import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { EditorModule } from 'primeng/editor';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-create-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, EditorModule],
  templateUrl: './create-category-form.component.html',
  styleUrl: './create-category-form.component.scss'
})
export class CreateCategoryFormComponent {

  newCategoryForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminGateway,
    public dialogRef: DialogRef<any>,
  ) { }

  ngOnInit() {
    this.newCategoryForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      description: ''
    });
  }

  createCategory() {
    this.isSubmitted = true;
    this.newCategoryForm.markAllAsTouched();
    if (this.newCategoryForm.valid) {
      this.adminService.createCategory(this.newCategoryForm.value).subscribe();
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }

}
