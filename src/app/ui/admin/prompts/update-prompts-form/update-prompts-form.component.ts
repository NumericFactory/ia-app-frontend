import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListboxChangeEvent, ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';
import { map, merge, switchMap } from 'rxjs';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { PromptModelAdmin, StepModelAdmin } from '../../../../core/models/step.model';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { UserGateway } from '../../../../core/ports/user.gateway';
import { MatDialogModule } from '@angular/material/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SetCursorPositionDirective } from '../../../../shared/directives/set-cursor-position.directive';
import { CdkDragDrop, CdkDragHandle, CdkDragPlaceholder, DragDropModule } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-update-prompts-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule,
    DropdownModule, ListboxModule, MatDialogModule, InputTextareaModule, SetCursorPositionDirective,
    DragDropModule, CdkDragHandle, CdkDragPlaceholder,
    AsyncPipe, NgFor, NgIf
  ],
  templateUrl: './update-prompts-form.component.html',
  styleUrl: './update-prompts-form.component.scss'
})
export class UpdatePromptsFormComponent {

  promptsForm!: FormGroup;
  prompts!: FormArray;
  steps: StepModelAdmin[] = [];

  variables = ['variable1', 'variable2', 'variable3', 'variable4', 'variable5']
  selectedVariable: string = '';

  cursorPositions: number[] = [];

  setCursor(index: number, position: number) {
    this.cursorPositions[index] = position; // Example position
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<string>,
    public dialog: Dialog,
    private adminService: AdminGateway,
    private confirmDialog: ConfirmDialogService,
    private userService: UserGateway,
    @Inject(DIALOG_DATA) public data: any,
  ) {
  }

  drop(event: CdkDragDrop<any>) {
    const dir = event.currentIndex > event.previousIndex ? 1 : -1;
    const from = event.previousIndex;
    const to = event.currentIndex;
    const temp = this.prompts.at(from);
    for (let i = from; i * dir < to * dir; i = i + dir) {
      const current = this.prompts.at(i + dir);
      this.prompts.setControl(i, current);
    }
    this.prompts.setControl(to, temp);

    this.promptsForm.value.prompts.forEach((question: any, index: number) => {
      question.order = index + 1;
    });

    console.log(this.promptsForm.value.prompts);

  }

  ngOnInit() {
    // subscribe to steps observable
    this.adminService.steps$.subscribe((steps) => this.steps = steps);

    // 
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

    this.cursorPositions = [0]; // Initial cursor positions

    /**
     * detect if user type '@' in secretPrompt textarea
     * if true, open dialog to select a variable
     */
    this.promptsForm.valueChanges.pipe(
      switchMap((f) => {
        const obs = this.formPrompts.controls.map((control, index) => {
          return control.valueChanges.pipe(
            map((value) => ({ value: value.secretprompt, i: index }))
          );
        });
        return merge(...obs);
      })
    ).subscribe(x => {
      if (x.value?.includes('@')) {

        const dialogRef = this.dialog.open(SelectVariableComponent, {
          width: '100%',
          minWidth: '320px',
          maxWidth: '450px',
          maxHeight: '60%',
          panelClass: 'dialog-user-var',
          data: {
            variables: this.data.variables,
            userSettings: this.userService.getUserFromSubject()?.settings,
            steps: this.steps
          }
        })
        dialogRef.closed.subscribe((result) => {

          if (x.i !== null) {
            let text = this.formPrompts.controls[x.i].get('secretprompt')?.value;
            // get cursor position
            let cursorPosIndex = [...text].findIndex((char) => char === '@');
            if (result === undefined) {
              text = text.replace('@', ''); // remove @ if no result
            }
            else {
              text = text.replace('@', '{' + result + '}')
              cursorPosIndex = cursorPosIndex + String(result).length + 2;
            }
            this.formPrompts.controls[x.i].get('secretprompt')?.setValue(text);
            this.setCursor(x.i, cursorPosIndex);
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
  async removePromptItem(index: number) {
    const deleteIsConfirmed = await this.confirmDialog.confirm('Supprimer', 'Attention! vous vous apprêtez à supprimer ce prompt. Vous devez Confirmer.');
    if (!deleteIsConfirmed) return;
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

    if (this.promptsForm.invalid) return;
    this.adminService.updatePrompts(this.promptsForm.value, this.data.id)
      .subscribe(() => this.dialogRef.close());
  }

  closeDialog() {
    this.dialogRef.close();
  }


} // end of CreatePromptsFormComponent



/**************************************
 * DialogComponent to select a variable
 **************************************/
@Component({
  selector: 'select-variable-dialog',
  standalone: true,
  imports: [FormsModule, ListboxModule, JsonPipe],

  template: `
  <div style="background: #fff" class="p-2">
    <h3 class="mb-0 p-2 fs-5">Choisissez une variable</h3>
    <ul class="nav nav-underline">
      <li class="nav-item">
        <a (click)="changeTab($event, 1)" [class.active]="tabInUsed==1" class="nav-link">Step variables</a>
      </li>
      <li class="nav-item">
        <a (click)="changeTab($event,2)" [class.active]="tabInUsed==2" class="nav-link">User settings</a>
      </li>
      <li class="nav-item">
        <a (click)="changeTab($event,3)" [class.active]="tabInUsed==3" class="nav-link" aria-disabled="true">Toutes les variables</a>
      </li>
    </ul>

    @if(tabInUsed === 1) {
      <p-listbox [options]="variables" 
       (onChange)="selectValue($event)"
       [style]="{'width':'100%'}"
       [listStyle]="{'max-height': '450px'}"></p-listbox>
    }
    @else if(tabInUsed === 2) {
      <p-listbox [options]="userSettings" 
      (onChange)="selectValue($event)"
      [style]="{'width':'100%'}"
      [listStyle]="{'max-height': '450px'}"></p-listbox>
    }
    @else if(tabInUsed === 3){
      @for(variables of steps; track variables) {
        @if(variables.length > 0) {
          <!-- <pre>{{step.variables | json}}</pre> -->
          <p-listbox [options]="variables" 
          (onChange)="selectValue($event)"
          [style]="{'width':'100%'}"
          [listStyle]="{'max-height': '450px'}"></p-listbox>
          <hr> 
        }
      }
    }
  </div>

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
  steps = this.data.steps.map((stepObj: any) =>
    stepObj.variables.map((variableObj: any) => variableObj.key)
  );
  userSettings = this.data.userSettings.map((settingObj: any) => settingObj.key);
  selectedVariable: string = 'variable1';
  tabInUsed: number = 1;

  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {

  }

  selectValue(event: ListboxChangeEvent) {
    this.dialogRef.close(event.value);
  }

  changeTab(event: Event, tab: number) {
    event.preventDefault();
    event.stopPropagation();
    this.tabInUsed = tab;
  }

}
