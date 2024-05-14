import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { StepModelAdmin } from '../../../../core/models/step.model';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { AsyncPipe, DatePipe, JsonPipe, } from '@angular/common';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { UpdateStepFormComponent } from '../../../../ui/admin/steps/update-step-form/update-step-form.component';
import { CreateStepFormComponent } from '../../../../ui/admin/steps/create-step-form/create-step-form.component';
import { CreatePromptsFormComponent } from '../../../../ui/admin/prompts/create-prompts-form/create-prompts-form.component';
import { Observable } from 'rxjs';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { CreateVariablesFormComponent } from '../../../../ui/admin/variables/create-variables-form/create-variables-form.component';
import { UpdateVariablesFormComponent } from '../../../../ui/admin/variables/update-variables-form/update-variables-form.component';
import { UpdatePromptsFormComponent } from '../../../../ui/admin/prompts/update-prompts-form/update-prompts-form.component';
import { CategoryModel } from '../../../../core/models/category.model';
import { CategoriesListComponent } from '../../../../ui/admin/categories/categories-list/categories-list.component';

@Component({
  selector: 'app-step-admin-view',
  standalone: true,
  imports: [DatePipe, DialogModule, AsyncPipe, JsonPipe],
  templateUrl: './step-admin-view.component.html',
  styleUrl: './step-admin-view.component.scss'
})
export class StepAdminViewComponent {

  stepsAdmin$: Observable<StepModelAdmin[]> = this.adminService.steps$;
  stepSelected!: StepModelAdmin;


  constructor(
    private adminService: AdminGateway,
    private dialog: Dialog,
    private confirmDialogService: ConfirmDialogService
  ) { }

  ngOnInit() {
    this.adminService.fetchSteps().subscribe();
  }

  openDialogCategories() {
    const dialogRef = this.dialog.open(CategoriesListComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '900px',
      maxWidth: '100%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var'
    });
  }

  openDialogCreateUserFormVariables(ev: Event, step: StepModelAdmin) {
    ev.stopPropagation();
    const dialogRef = this.dialog.open(CreateVariablesFormComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '900px',
      maxWidth: '100%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var',
      data: { ...step } as StepModelAdmin
    });

    dialogRef.closed.subscribe((result: any) => {
      // get the selected roles
      if (!result) return;
      // update the user role
      //this.adminService.setRoles(user.id, justSelectedRoles);
    });
  }

  openDialogUpdateUserFormVariables(ev: Event, step: StepModelAdmin) {
    ev.stopPropagation();
    const dialogRef = this.dialog.open(UpdateVariablesFormComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '900px',
      maxWidth: '100%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var',
      data: { ...step }
    });
    dialogRef.closed.subscribe((result: any) => {
      if (!result) return;
    });
  }

  openDialogCreateStep() {
    const dialogRef = this.dialog.open(CreateStepFormComponent, {
      disableClose: true,
      width: '100%',
      minWidth: '320px',
      maxWidth: '750px',
      maxHeight: '85%',
      panelClass: 'dialog-user-var'
    });

    dialogRef.closed.subscribe((result: any) => {
      if (!result) return;
      console.log(result);
      // create the Step
      this.adminService.createStep(result).subscribe();
    });
  }

  openDialogUpdateStep(ev: Event, step: StepModelAdmin) {
    ev.stopPropagation();
    const dialogRef = this.dialog.open(UpdateStepFormComponent, {
      disableClose: true,
      width: '100%',
      minWidth: '320px',
      maxWidth: '750px',
      maxHeight: '85%',
      panelClass: 'dialog-user-var',
      data: { ...step } as StepModelAdmin
    });

    dialogRef.closed.subscribe((result: any) => {
      if (!result) return;
      console.log(result);
      // update the Step
      result.id = step.id;
      this.adminService.updateStep(result).subscribe();
    });
  }

  async openDialogCreatePrompt(ev: Event, step: StepModelAdmin) {
    ev.stopPropagation();
    console.log(step);
    const dialogRef = this.dialog.open(CreatePromptsFormComponent, {
      disableClose: true,
      width: '100%',
      minWidth: '320px',
      maxWidth: '1299px',
      maxHeight: '85%',
      panelClass: 'dialog-user-var',
      data: { ...step }
    });
    dialogRef.closed.subscribe((result: any) => {
      if (!result) return;
      console.log(result);
    });
  }

  async openDialogUpdatePrompt(ev: Event, step: StepModelAdmin) {
    ev.stopPropagation();
    console.log(step);
    const dialogRef = this.dialog.open(UpdatePromptsFormComponent, {
      disableClose: true,
      width: '100%',
      minWidth: '320px',
      maxWidth: '1299px',
      maxHeight: '85%',
      panelClass: 'dialog-user-var',
      data: { ...step }
    });
    dialogRef.closed.subscribe((result: any) => {
      if (!result) return;
      console.log(result);
    });
  }

  async deleteStepAction(ev: Event, step: StepModelAdmin) {
    ev.stopPropagation();
    console.log(step);
    const isValid = await this.confirmDialogService.confirm(
      `Supprimer le step`,
      `Supprimer "${step.subtitle}" et toutes les données associées,
      y compris les prompts et les variables ?`
    );
    console.log(isValid);
    if (!isValid) return;
    this.adminService.deleteStep(step.id).subscribe();
  }

}
