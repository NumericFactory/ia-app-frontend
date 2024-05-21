import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog";
import { JsonPipe, NgFor, NgIf } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { AdminGateway } from "../../../../core/ports/admin.gateway";
import { FormUISchema } from "../../../../core/models/step.model";
import { ConfirmDialogService } from "../../../../shared/services/confirm-dialog.service";
import { CdkDragDrop, CdkDragHandle, CdkDragPlaceholder, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ui-update-variables-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule, JsonPipe, MatButtonModule, NgFor, NgIf, DragDropModule, CdkDragHandle, CdkDragPlaceholder],
  template: `
  <h3 class="fs-5">Mettre à jour les questions</h3>
  <button (click)="closeDialog()" class="btn"><i class="bi bi-x-lg close-dialog-btn"></i></button>
  <!-- info text -->
  <p class="text-secondary info-text">
    <i class="bi bi-info-circle-fill text-primary"></i>
    Step <strong>{{data.subtitle}}</strong> | Sauvegarder pour mettre à jour les questions
  </p>
  <hr>

  <form [formGroup]="questionsForm" (ngSubmit)="onSubmit()">

    <div id="list-parent-iterator"  cdkDropList
        [cdkDropListData]="questions['controls']"
        (cdkDropListDropped)="drop($event)">

    <div id="list-sub-parent-iterator"
          cdkDrag
          [cdkDragLockAxis]="'y'"
          [cdkDragData]="item"
          formArrayName="questions" *ngFor="let item of formData.controls; let i = index; let c = count">
          <div class="example-custom-placeholder" *cdkDragPlaceholder></div>
      <div class="line" [formGroupName]="i">
       <!-- <span>{{i+1}}</span> -->
        <div class="row mb-4">


          <div class="py-3 col-1 d-flex flex-column align-items-baseline justify-content-between">
            <!-- required -->
            <div class="d-flex">
              <input class="form-check-input ms-2" type="checkbox" formControlName="required">
              <div class="example-handle ms-2" cdkDragHandle>
                <svg width="24px" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path>
                  <path d="M0 0h24v24H0z" fill="none"></path>
                </svg>
              </div>
            </div>
            <!-- remove item -->
            <button type="button" class="btn btn-link fs-3 p-0 m-0 text-secondary" (click)="removeQuestionItem(i)" title="Supprimer la ligne">
              <i class="bi bi-x"></i>
            </button>
          </div>

          <div class="col-11">
            <div class="row gx-2 gy-1">

              <!-- input key -->
              <div class="col-3"><input class="form-control" formControlName="key" placeholder="key"></div>
              <!-- input label -->
              <div class="col-3"><input class="form-control" formControlName="label" placeholder="label"></div>
              <!-- select controle type -->
              <div class="col-3">
                <select class="form-control" formControlName="controltype">
                  <option value="input">input</option>
                  <option value="textarea">textarea</option>
                  <option disabled value="select">select</option>
                </select>
              </div>
              <!-- select type -->
              <div class="col-3">
                <select class="form-control" formControlName="type">
                  <option value="text">text</option>
                  <option value="number">number</option>
                  <option value="date">date</option>
                  <option value="url">url</option>
                  <option value="color">color</option>
                  <option value="range">range</option>
                  <option value="time">time</option>
                  <option value="datetime-local">datetime-local</option>
                </select>
              </div>
              <!-- textarea information -->
              <div class="col-12"><textarea placeholder="informations" class="form-control" formControlName="information"></textarea></div>
            
            </div><!-- end row -->
          </div><!-- end col -->
        
        </div><!-- end row -->
      </div> <!-- end line -->
  </div> <!-- end formArrayName -->
  </div> <!-- end parent -->

  <!-- BOUTON AJOUTER UNE QUESTION-->
  <div class="form-group d-flex justify-content-center">
    <button class="btn btn-sm btn-secondary" type="button" (click)="addQuestionItem()">Ajouter une question</button>
  </div>
  <hr>
  <!-- BOUTON VALIDER -->
  <div class="d-flex justify-content-end">
    <button mat-button type="button" (click)="dialogRef.close()">Annuler</button>
    <button class="btn btn-primary" type="submit">Sauvegarder {{formData.controls.length}}</button>
  </div>
     
  </form>
  `,
  styles: [`:host {
    display: block;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 8px 16px 16px;
  }
  .cdk-drag-animating {
    transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
  }

  .example-box:last-child {
    border: none;
  }
  .example-custom-placeholder {
    background: #f8f9faaa;
    border: dotted 3px lightblue;
    min-height: 100px;
    width: 100%;
    display: block;
    transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
  }
  .list-sub-parent-iterator  {
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
              0 8px 10px 1px rgba(0, 0, 0, 0.14),
              0 3px 14px 2px rgba(0, 0, 0, 0.12);
}

  p.info-text {
    font-size: 0.925rem;
    i {
      font-size: 1rem;
      margin-right: 5px;
    }
  }

  .alert {
    margin-top: 0.5rem;
    padding: 0.5rem;
    font-size: 0.875rem;
}
  
  input, select {
    margin: 4px 0;
  }
  
  button + button {
    margin-left: 8px;
  } 
  form input.form-control, form select.form-control, form textarea.form-control {
    padding: 0.325rem 0.65rem;
  }
  `]
})
export class UpdateVariablesFormComponent {


  questionsForm !: FormGroup;
  questions!: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<string>,
    private adminService: AdminGateway,
    private confirmDialog: ConfirmDialogService,
    @Inject(DIALOG_DATA) public data: any,

  ) { }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.questions
  //     ? this.questions.setControl('questions', this.questions)
  //     : noop();
  // }

  drop(event: CdkDragDrop<any>) {
    const dir = event.currentIndex > event.previousIndex ? 1 : -1;
    const from = event.previousIndex;
    const to = event.currentIndex;
    const temp = this.questions.at(from);
    for (let i = from; i * dir < to * dir; i = i + dir) {
      const current = this.questions.at(i + dir);
      this.questions.setControl(i, current);
    }
    this.questions.setControl(to, temp);

    this.questionsForm.value.questions.forEach((question: any, index: number) => {
      question.order = index + 1;
    });

    console.log(this.questionsForm.value.questions);

  }


  ngOnInit() {
    // create the questionsForm
    this.questionsForm = this.formBuilder.group({
      questions: this.formBuilder.array([]),
    });
    this.questions = this.questionsForm.get('questions') as FormArray;

    // populate the formArray questions with each variable of the step
    const variables = this.data.variables;
    for (let variable of variables) {
      this.questions.push(this.createQuestionFormControl(variable));
    }
  }

  // Permet de créer un QuestionForm à la volée
  createQuestionFormControl(variable?: FormUISchema): FormGroup {
    return this.formBuilder.group({
      id: variable?.id || null, // id of the variable in the database or null if it's a new variable
      stepId: variable?.stepId || this.data.id, // id of the step in the database
      key: [variable?.key || '', Validators.required],
      label: [variable?.label || '', Validators.required],
      controltype: variable?.controltype || 'input',
      type: variable?.type || 'text',
      required: variable?.required || false,
      information: variable?.information || '',
      order: variable?.order || 1,
      is_usersetting: false
    });
  }

  // Au clic de l'utilisateur sur le bouton "Ajouter une ligne"
  addQuestionItem(): void {
    this.questions.push(this.createQuestionFormControl());
  }

  // Au clic de l'utilisateur sur le bouton "Supprimer la ligne"
  async removeQuestionItem(index: number) {
    const deleteIsConfirmed = await this.confirmDialog.confirm('Supprimer', 'Attention! vous vous apprêtez à supprimer cette question. Confirmer ?');
    if (!deleteIsConfirmed) return;
    if (this.questionsForm.value.questions[index].id) {
      this.adminService.deleteVariable(this.questionsForm.value.questions[index].id).subscribe();
    }
    this.questions.removeAt(index);
    if (this.questions.length === 0) {
      this.dialogRef.close();
    }
  }

  // Permet de récupérer formData dans la vue qui est une instance de FormArray
  get formData() {
    return <FormArray>this.questionsForm.get('questions');
  }

  onSubmit() {
    if (this.questionsForm.invalid) return;
    this.adminService.updateVariables(this.questionsForm.value, this.data.id)
      .subscribe(() => this.dialogRef.close());
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
