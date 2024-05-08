import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-create-step-form',
  standalone: true,
  imports: [ReactiveFormsModule, EditorModule],
  templateUrl: './create-step-form.component.html',
  styleUrl: './create-step-form.component.scss'
})
export class CreateStepFormComponent {

  createStepForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {

    this.createStepForm = this.formBuilder.group({
      title: ['', Validators.required],
      subtitle: [''],
      desc: [''],
      //formStepUserVariables: this.formBuilder.array([]),
      //prompts: this.formBuilder.array([])
    });
  }


  onSubmit() {
    console.log('submit', this.createStepForm.value);
    this.dialogRef.close(this.createStepForm.value);
  }

  closeDialog() {
    this.dialogRef.close();
  }



}
