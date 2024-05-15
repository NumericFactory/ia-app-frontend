import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { AdminGateway } from '../../../../core/ports/admin.gateway';

@Component({
  selector: 'app-update-step-form',
  standalone: true,
  imports: [ReactiveFormsModule, EditorModule, FormsModule],
  templateUrl: './update-step-form.component.html',
  styleUrl: './update-step-form.component.scss'
})
export class UpdateStepFormComponent {

  updateStepForm!: FormGroup;
  isvisibleControl: FormControl = new FormControl(true);

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
    private adminService: AdminGateway
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.updateStepForm = this.formBuilder.group({
      title: [this.data.title],
      subtitle: [this.data.subtitle],
      desc: [this.data.desc],
      //formStepUserVariables: this.formBuilder.array([]),
      //prompts: this.formBuilder.array([])
    });

    this.isvisibleControl.setValue(this.data.isVisible);

    this.isvisibleControl.valueChanges.subscribe((value) => {
      this.changeStepVisibilityAction()
    });
  }

  onEditorInit(ev: any) {
    console.log('Editor is ready', ev);
    // ev.editor.setContents(this.data.desc);
    // ev.editor.root.innerHTML = this.data.desc;
    ev.editor.clipboard.dangerouslyPasteHTML(0, this.data.desc);
    //this.updateStepForm.patchValue({ title: 'Hello', desc: this.data.desc });
  }

  onSubmit() {
    this.dialogRef.close(this.updateStepForm.value);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  changeStepVisibilityAction() {
    this.adminService.setStepVisibility(this.data.id, this.isvisibleControl.value).subscribe();
  }



}
