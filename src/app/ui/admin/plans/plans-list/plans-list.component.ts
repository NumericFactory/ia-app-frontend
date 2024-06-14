import { Dialog, } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { CategoryModel } from '../../../../core/models/category.model';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { UpdatePlanFormComponent } from '../update-plan-form/update-plan-form.component';
import { CreatePlanFormComponent } from '../create-plan-form/create-plan-form.component';

@Component({
  selector: 'app-plans-list',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './plans-list.component.html',
  styleUrl: './plans-list.component.scss'
})
export class PlansListComponent {

  plans$ = this.adminService.plans$;

  constructor(
    // public dialogRef: DialogRef<any>,
    public dialog: Dialog,
    private adminService: AdminGateway,
    private confirmationService: ConfirmDialogService,
    // @Inject(DIALOG_DATA) public data: CategoryModel[],
  ) { }

  ngOnInit() {
    this.adminService.fetchPlans().subscribe();
  }

  close() {
    // this.dialogRef.close();
  }

  openDialogCreatePlan() {
    // open dialog
    this.dialog.open(CreatePlanFormComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '900px',
      maxWidth: '100%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var'
    });
  }

  openDialogUpdatePlan(event: Event, plan: any) {
    event.stopPropagation();
    // open dialog
    this.dialog.open(UpdatePlanFormComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '900px',
      maxWidth: '100%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var',
      data: plan
    });
  }

  async deletePlan(event: Event, plan: any) {
    event.stopPropagation();
    if (plan.id === undefined) {
      return;
    }
    const deletePlanConfirmation = await this.confirmationService
      .confirm('Supprimer', 'Confirmer pour supprimer ce plan')
    if (!deletePlanConfirmation) {
      return;
    }
    this.adminService.deletePlan(plan.id).subscribe();
  }

}
