import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EditorModule } from 'primeng/editor';
import { AdminGateway } from '../../../../core/ports/admin.gateway';

@Component({
  selector: 'app-update-plan-form',
  standalone: true,
  imports: [ReactiveFormsModule, EditorModule, MatSlideToggleModule, FormsModule],
  templateUrl: './update-plan-form.component.html',
  styleUrl: './update-plan-form.component.scss'
})
export class UpdatePlanFormComponent {

  updatePlanForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminGateway,
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.updatePlanForm = this.fb.group({
      id: [this.data.id, Validators.required],
      title: [this.data.title, Validators.required],
      slug: [this.data.slug, Validators.required],
      description: this.data.description ? this.data.description : '',
      image_url: this.data.imageUrl ? this.data.imageUrl : '',
      is_plan: this.data.isPlan === 1,
      is_featured: this.data.isFeatured === 1,
      is_visible: this.data.isVisible === 1,
    });
  }

  updatePlan() {
    this.isSubmitted = true;
    this.updatePlanForm.markAllAsTouched();
    if (this.updatePlanForm.invalid || this.data.id === undefined) return;
    this.adminService.updatePlan(this.data.id, this.updatePlanForm.value).subscribe();
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}
