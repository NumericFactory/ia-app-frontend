import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListboxChangeEvent, ListboxModule } from 'primeng/listbox';
import { map, merge, switchMap } from 'rxjs';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';

@Component({
  selector: 'app-create-prompts-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ListboxModule, JsonPipe, NgFor, NgIf],
  templateUrl: './create-prompts-form.component.html',
  styleUrl: './create-prompts-form.component.scss'
})
export class CreatePromptsFormComponent {

  createPromptsForm!: FormGroup;
  prompts!: FormArray;

  variables = ['variable1', 'variable2', 'variable3', 'variable4', 'variable5']
  selectedVariable: string = '';

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<string>,
    public dialog: Dialog,
    private adminService: AdminGateway,
    private confirmDialog: ConfirmDialogService,
    @Inject(DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    console.log('data', this.data);
    this.createPromptsForm = this.formBuilder.group({
      prompts: this.formBuilder.array([this.createPromptFormControl()]),

    });

    /**
     * detect if user type '@' in secretPrompt textarea
     * if true, open dialog to select a variable
     */
    this.createPromptsForm.valueChanges.pipe(
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
  createPromptFormControl(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      secretprompt: ['', Validators.required],
      desc: '',
      order: 1
    });
  }

  // Au clic de l'utilisateur sur le bouton "Ajouter une ligne"
  addPromptItem(): void {
    this.prompts = this.createPromptsForm.get('prompts') as FormArray;
    this.prompts.push(this.createPromptFormControl());
    this.prompts.controls.forEach((control, index) => {
      control.get('order')?.setValue(index + 1);
    });
  }

  // Au clic de l'utilisateur sur le bouton "Supprimer la ligne"
  async removePromptItem(index: number) {
    const deleteIsConfirmed = await this.confirmDialog.confirm('Supprimer', 'Attention! vous vous apprêtez à supprimer ce prompt. Vous devez Confirmer.');
    if (!deleteIsConfirmed) return;
    this.prompts = this.createPromptsForm.get('prompts') as FormArray;
    this.prompts.removeAt(index);
    this.prompts.controls.forEach((control, index) => {
      control.get('order')?.setValue(index + 1);
    });
  }

  // Permet de récupérer formPrompts dans la vue qui est une instance de FormArray
  get formPrompts() {
    return <FormArray>this.createPromptsForm.get('prompts');
  }

  onSubmit() {
    console.log('submit', this.createPromptsForm.value);
    if (this.createPromptsForm.invalid) return;
    this.adminService.createPrompts(this.createPromptsForm.value, this.data.id)
      .subscribe(() => this.dialogRef.close());
  }

  closeDialog() {
    console.log('close dialog');
    this.dialogRef.close();
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
