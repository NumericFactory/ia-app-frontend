import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-update-step-form',
  standalone: true,
  imports: [ReactiveFormsModule, EditorModule, FormsModule],
  templateUrl: './update-step-form.component.html',
  styleUrl: './update-step-form.component.scss'
})
export class UpdateStepFormComponent {

  updateStepForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    console.log('data', this.data);
    this.updateStepForm = this.formBuilder.group({
      title: [this.data.title],
      subtitle: [this.data.subtitle],
      desc: [this.data.desc],
      //formStepUserVariables: this.formBuilder.array([]),
      //prompts: this.formBuilder.array([])
    });
  }

  ngAfterViewInit() {
    // this.updateStepForm.setValue({ desc: this.data.desc });
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



}
