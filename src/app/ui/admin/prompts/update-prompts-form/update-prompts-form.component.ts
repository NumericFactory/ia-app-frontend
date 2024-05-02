import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListboxChangeEvent, ListboxModule } from 'primeng/listbox';
import { map, merge, switchMap } from 'rxjs';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { PromptModelAdmin } from '../../../../core/models/step.model';

@Component({
  selector: 'app-update-prompts-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ListboxModule, JsonPipe, NgFor, NgIf],
  templateUrl: './update-prompts-form.component.html',
  styleUrl: './update-prompts-form.component.scss'
})
export class UpdatePromptsFormComponent {

  promptsForm!: FormGroup;
  prompts!: FormArray;

  variables = ['variable1', 'variable2', 'variable3', 'variable4', 'variable5']
  selectedVariable: string = '';

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<string>,
    public dialog: Dialog,
    private adminService: AdminGateway,
    @Inject(DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    // console.log('data', this.data);
    // create PromptsForm
    this.promptsForm = this.formBuilder.group({
      prompts: this.formBuilder.array([]),
    });
    this.prompts = this.promptsForm.get('prompts') as FormArray;

    // populate the formArray prompts with each prompt of the step
    const prompts = this.data.prompts;
    for (let prompt of prompts) {
      this.prompts.push(this.createPromptFormControl(prompt));
    }

    /**
     * detect if user type '@' in secretPrompt textarea
     * if true, open dialog to select a variable
     */
    this.promptsForm.valueChanges.pipe(
      switchMap((f) => {
        const obs = this.formPrompts.controls.map((control, index) => {
          return control.valueChanges.pipe(map((value) => ({ value: value.secretprompt, i: index })));
        });
        return merge(...obs);
      })
    ).subscribe(x => {
      if (x.value?.includes('@')) {
        const dialogRef = this.dialog.open(SelectVariableComponent, {
          width: '100%',
          minWidth: '220px',
          maxWidth: '250px',
          maxHeight: '55%',
          panelClass: 'dialog-user-var',
          data: { variables: this.data.variables }
        })
        dialogRef.closed.subscribe((result) => {
          if (x.i !== null) {
            let text = this.formPrompts.controls[x.i].get('secretprompt')?.value;
            !result
              ? text = text.replace('@', '')
              : text = text.replace('@', '{' + result + '}')
            this.formPrompts.controls[x.i].get('secretprompt')?.setValue(text);
          }
        });
      }
    });



  }

  // Permet de créer un Prompt Form à la volée
  createPromptFormControl(prompt?: PromptModelAdmin): FormGroup {
    return this.formBuilder.group({
      id: prompt?.id || null, // id of the prompt in the database or null if it's a new prompt
      title: [prompt?.title || '', Validators.required],
      secretprompt: [prompt?.secretprompt || '', Validators.required],
      desc: prompt?.desc || '',
      order: 1
    });
  }

  // Au clic de l'utilisateur sur le bouton "Ajouter une ligne"
  addPromptItem(): void {
    this.prompts = this.promptsForm.get('prompts') as FormArray;
    this.prompts.push(this.createPromptFormControl());
    this.prompts.controls.forEach((control, index) => {
      control.get('order')?.setValue(index + 1);
    });
  }

  // Au clic de l'utilisateur sur le bouton "Supprimer la ligne"
  removePromptItem(index: number): void {
    if (this.promptsForm.value.prompts[index].id) {
      this.adminService.deletePrompt(this.promptsForm.value.prompts[index].id).subscribe();
    }
    this.prompts = this.promptsForm.get('prompts') as FormArray;
    this.prompts.removeAt(index);
    this.prompts.controls.forEach((control, index) => {
      control.get('order')?.setValue(index + 1);
    });
    if (this.prompts.length === 0) {
      this.dialogRef.close();
    }
  }

  // Permet de récupérer formPrompts dans la vue qui est une instance de FormArray
  get formPrompts() {
    return <FormArray>this.promptsForm.get('prompts');
  }

  onSubmit() {
    console.log('submit', this.promptsForm.value);
    if (this.promptsForm.invalid) return;
    this.adminService.updatePrompts(this.promptsForm.value, this.data.id)
      .subscribe(() => this.dialogRef.close());
  }


} // end of CreatePromptsFormComponent



/**************************************
 * DialogComponent to select a variable
 **************************************/
@Component({
  selector: 'select-variable-dialog',
  standalone: true,
  imports: [FormsModule, ListboxModule],

  template: `
  <p-listbox [options]="variables" 
    (onChange)="selectValue($event)"
    [style]="{'width':'15rem'}"
    [listStyle]="{'max-height': '220px'}"></p-listbox>
  `,

  styles: [`
  .p-listbox .p-listbox-list .p-listbox-item {
    margin: 2px 0 !important;
    padding: 0rem 0rem !important;
    border: 0 none;
    color: #334155;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, outline-color 0.2s;
    border-radius: 4px;
  } 
  .p-listbox .p-listbox-list {
    margin: 0 !important; padding: 0 !important;
    padding-left: 0 !important;
  }
 
  .p-listbox .p-listbox-list .p-listbox-item {
    margin: 0;
    padding: 0.55rem 1.25rem;
    cursor: pointer;
    border-radius: 4px;
  }
  ul {
    padding-left: 0 !important;
  }
  `]
})

export class SelectVariableComponent {

  variables = this.data.variables.map((variableObj: any) => variableObj.key);
  selectedVariable: string = 'variable1';

  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
  ) { }

  selectValue(event: ListboxChangeEvent) {
    this.dialogRef.close(event.value);
  }

}
