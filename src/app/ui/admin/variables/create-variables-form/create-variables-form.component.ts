import { Component, Inject } from "@angular/core";
import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog";
import { JsonPipe, NgFor, NgIf } from "@angular/common";
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { AdminGateway } from "../../../../core/ports/admin.gateway";
import { ConfirmDialogService } from "../../../../shared/services/confirm-dialog.service";

@Component({
  selector: 'ui-create-variables-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule, JsonPipe, MatButtonModule, NgFor, NgIf],
  template: `
  <h3 class="fs-5">Ajouter des questions</h3>
  <!-- info text -->
  <p class="text-secondary info-text">
    <i class="bi bi-info-circle-fill text-primary"></i>
    Step <strong>{{data.subtitle}}</strong> | valider pour ajouter des questions
  </p>
  <hr>

  <form [formGroup]="questionsForm" (ngSubmit)="onSubmit()">
    <div formArrayName="questions" *ngFor="let item of formData.controls; let i = index; let c = count">
      <div class="line" [formGroupName]="i">
       <!-- <span>{{i+1}}</span> -->
        <div class="row mb-4">
          <div class="py-3 col-1 d-flex flex-column align-items-baseline justify-content-between">
            <!-- required -->
            <div><input class="form-check-input ms-2" type="checkbox" formControlName="required"></div>
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

  <!-- BOUTON AJOUTER UNE QUESTION-->
  <div class="form-group d-flex justify-content-center">
    <button class="btn btn-sm btn-secondary" type="button" (click)="addQuestionItem()">Ajouter une question</button>
  </div>
  <hr>
  <!-- BOUTON VALIDER -->
  <div class="d-flex justify-content-end">
    <button mat-button type="button" (click)="dialogRef.close()">Annuler</button>
    <button class="btn btn-primary" type="submit">Valider {{formData.controls.length}}</button>
  </div>
     
  </form>
  `,
  styles: [`:host {
    display: block;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 8px 16px 16px;
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
export class CreateVariablesFormComponent {

  questionsForm !: FormGroup;
  questions!: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
    private adminService: AdminGateway,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit() {

    this.questionsForm = this.formBuilder.group({
      questions: this.formBuilder.array([this.createQuestionFormControl()]),
    });
  }

  // Permet de créer un QuestionForm à la volée
  createQuestionFormControl(): FormGroup {
    return this.formBuilder.group({
      key: ['', Validators.required],
      label: ['', Validators.required],
      controltype: 'input',
      type: 'text',
      required: true,
      information: '',
      order: 1
    });
  }

  // Au clic de l'utilisateur sur le bouton "Ajouter une ligne"
  addQuestionItem(): void {
    this.questions = this.questionsForm.get('questions') as FormArray;
    this.questions.push(this.createQuestionFormControl());
    this.questions.controls.forEach((control, index) => {
      control.get('order')?.setValue(index + 1);
    });
  }

  // Au clic de l'utilisateur sur le bouton "Supprimer la ligne"
  async removeQuestionItem(index: number) {
    const deleteIsConfirmed = await this.confirmDialog.confirm('Supprimer', 'Attention! vous vous apprêtez à supprimer cette question. Confirmer ?');
    if (!deleteIsConfirmed) return;
    this.questions = this.questionsForm.get('questions') as FormArray;
    this.questions.removeAt(index);
    this.questions.controls.forEach((control, index) => {
      control.get('order')?.setValue(index + 1);
    });
  }

  // Permet de récupérer formData dans la vue qui est une instance de FormArray
  get formData() {
    return <FormArray>this.questionsForm.get('questions');
  }

  onSubmit() {
    if (this.questionsForm.invalid) return;
    this.adminService.createVariables(this.questionsForm.value, this.data.id)
      .subscribe(() => this.dialogRef.close());
  }


}
