import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { EditorModule } from 'primeng/editor';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-create-plan-form',
  standalone: true,
  imports: [ReactiveFormsModule, EditorModule, MatSlideToggleModule, FormsModule],
  templateUrl: './create-plan-form.component.html',
  styleUrl: './create-plan-form.component.scss'
})
export class CreatePlanFormComponent {

  newPlanForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminGateway,
    public dialogRef: DialogRef<any>,
  ) { }

  ngOnInit() {
    this.newPlanForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      description: '',
      image_url: '',
      is_plan: [true, Validators.required],
      is_featured: [false, Validators.required],
      is_visible: [true, Validators.required],
    });
  }

  createPlan() {
    this.isSubmitted = true;
    this.newPlanForm.markAllAsTouched();
    if (this.newPlanForm.valid) {
      this.adminService.createPlan(this.newPlanForm.value).subscribe();
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }

}
