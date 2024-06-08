import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DragDropModule, CdkDragHandle, CdkDragPlaceholder, CdkDragDrop } from '@angular/cdk/drag-drop';
import { JsonPipe, NgIf, NgFor, CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { UiDragDropIconComponent } from '../../../items/item-drag-drop/ui-drag-drop-icon.component';
import { UiChoiceInputTypeSelectorComponent } from '../../../../shared/services/question/ui-choice-input-type-selector/ui-choice-input-type-selector.component';
import { ProgressBarModule } from 'primeng/progressbar';
type InputType = string | 'shorttext' | 'longtext' | 'select' | 'number' | 'date' | 'url' | 'color' | 'range' | 'time' | 'datetime-local';
type selectTypeBoxHtmlElement = { name: string, value: InputType, icon: string } | null; //  { name: 'short text', value: 'text', icon: 'bi-paragraph' }

@Component({
  selector: 'ui-manage-user-settings-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatCheckboxModule, UiChoiceInputTypeSelectorComponent,
    DragDropModule, CdkDragHandle, CdkDragPlaceholder, ProgressBarModule,
    JsonPipe, NgIf, NgFor, UiDragDropIconComponent,
    MatButtonModule, CommonModule],
  templateUrl: './manage-user-settings-form.component.html',
  styleUrl: './manage-user-settings-form.component.scss'
})
export class ManageUserSettingsFormComponent {
  isLoadingData = false;
  settingsForm !: FormGroup;

  questions!: FormArray;
  selectTypeBoxHtmlElement!: selectTypeBoxHtmlElement; //  { name: 'short text', value: 'text', icon: 'bi-paragraph' }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
    private adminService: AdminGateway,
    private confirmDialog: ConfirmDialogService
  ) { }


  drop(event: CdkDragDrop<any>) {
    const dir = event.currentIndex > event.previousIndex ? 1 : -1;
    const from = event.previousIndex, to = event.currentIndex, temp = this.questions.at(from);
    for (let i = from; i * dir < to * dir; i = i + dir) {
      const current = this.questions.at(i + dir);
      this.questions.setControl(i, current);
    }
    this.questions.setControl(to, temp);
    this.settingsForm.value.settings.forEach((question: any, index: number) => {
      question.order = index + 1;
    });
  }
  // Permet de récupérer formPrompts dans la vue qui est une instance de FormArray
  get formSettings() {
    return <FormArray>this.settingsForm.get('settings');
  }


  ngOnInit() {
    this.isLoadingData = true;
    // build the form
    this.settingsForm = this.formBuilder.group({
      settings: this.formBuilder.array([this.createQuestionFormControl()]),
    });
    // set the form values
    this.adminService.getUserParametersFields().subscribe((fields) => {
      this.settingsForm = this.formBuilder.group({
        settings: this.formBuilder.array(fields.map((field: any) => {
          // console.log('field:', field);
          return this.formBuilder.group(field)
        }))
      });

      this.formData.controls.forEach((control: any, index: any) => {
        control.get('selectOptions')?.disable();
        if (control.get('controltype').value === 'select') {
          control.get('selectOptions')?.enable();
        }
      });

      this.questions = this.settingsForm.get('settings') as FormArray;
      this.isLoadingData = false;
    });
  }

  /**
   * selectInputTypeAction
   *  - set controltype: 'input' | 'select' | 'textarea'
   *  - set type: InputType
   * @param typeOfSelectField: selectTypeBoxHtmlElement
   * @param index: number
   */
  selectInputTypeAction(typeOfSelectField: selectTypeBoxHtmlElement, index: number) {
    this.selectTypeBoxHtmlElement = typeOfSelectField;
    console.log('selectInputTypeAction:', typeOfSelectField, index);
    this.formData.controls[index].patchValue({
      controltype: 'input',     // 'input' | 'select' | 'textarea'
      type: typeOfSelectField?.value, // 'text' | 'color' | 'date' | 'number' | ...
      //selectOptions: null
    });
    this.formData.controls[index].get('selectOptions')?.disable();
    if (typeOfSelectField?.value === 'select') {
      this.formData.controls[index].patchValue({ controltype: 'select', type: null });
      this.formData.controls[index].get('selectOptions')?.enable();
    }
    else if (typeOfSelectField?.value === 'longtext') {
      this.formData.controls[index].patchValue({ controltype: 'textarea', type: null });
    }
  }

  getUser(userId: number) {
    this.adminService.fetchUserById(userId).subscribe();
  }

  // Permet de créer un QuestionForm à la volée
  createQuestionFormControl(): FormGroup {
    return this.formBuilder.group({
      key: ['', Validators.required],
      label: ['', Validators.required],
      controltype: 'input',
      selectOptions: '',
      type: 'text',
      required: true,
      information: '',
      order: 1
    });
  }

  // Au clic de l'utilisateur sur le bouton "Ajouter une ligne"
  addQuestionItem(): void {
    this.questions = this.settingsForm.get('settings') as FormArray;
    this.questions.push(this.createQuestionFormControl());
    this.questions.controls.forEach((control, index) => {
      control.get('order')?.setValue(index + 1);
    });
  }

  // Au clic de l'utilisateur sur le bouton "Supprimer la ligne"
  async removeQuestionItem(index: number) {
    const deleteIsConfirmed = await this.confirmDialog.confirm('Supprimer', 'Attention! vous vous apprêtez à supprimer cette question. Confirmer ?');
    if (!deleteIsConfirmed) return;
    if (this.settingsForm.value.settings[index].id) {
      this.adminService.deleteUserSettings(this.settingsForm.value.settings[index].id).subscribe();
    }
    this.questions = this.settingsForm.get('settings') as FormArray;
    this.questions.removeAt(index);
    this.questions.controls.forEach((control: any, index: any) => {
      control.get('order')?.setValue(index + 1);
    });
    if (this.questions.length === 0) {
      this.dialogRef.close();
    }
  }

  // Permet de récupérer formData dans la vue qui est une instance de FormArray
  get formData() {
    return <FormArray>this.settingsForm.get('settings');
  }

  onSubmit() {
    console.log(this.settingsForm.value);
    if (this.settingsForm.invalid) return;
    this.adminService.createOrUpdateUserSettings(this.settingsForm.value)
      .subscribe(() => this.dialogRef.close());
  }

  closeDialog() {
    this.dialogRef.close();
  }


}
