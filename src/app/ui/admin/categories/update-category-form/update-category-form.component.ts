import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { CategoryModel } from '../../../../core/models/category.model';

@Component({
  selector: 'app-update-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, EditorModule],
  templateUrl: './update-category-form.component.html',
  styleUrl: './update-category-form.component.scss'
})
export class UpdateCategoryFormComponent {

  updateCategoryForm!: FormGroup;
  isSubmitted = false;


  constructor(
    private fb: FormBuilder,
    private adminService: AdminGateway,
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: CategoryModel,
  ) { }

  ngOnInit() {

    this.updateCategoryForm = this.fb.group({
      id: [this.data.id, Validators.required],
      title: [this.data.title, Validators.required],
      slug: [this.data.slug, Validators.required],
      description: this.data.description ? this.data.description : '',
    });
  }

  updateCategory() {
    this.isSubmitted = true;
    this.updateCategoryForm.markAllAsTouched();
    if (this.updateCategoryForm.invalid || this.data.id === undefined) return;
    this.adminService.updateCategory(this.data.id, this.updateCategoryForm.value).subscribe();
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}
