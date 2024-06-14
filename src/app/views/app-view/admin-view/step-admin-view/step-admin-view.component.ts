import { Component, Inject } from '@angular/core';
import { PromptModelAdmin, StepModelAdmin } from '../../../../core/models/step.model';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { AsyncPipe, DatePipe, JsonPipe, NgFor } from '@angular/common';
import { DIALOG_DATA, Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { UpdateStepFormComponent } from '../../../../ui/admin/steps/update-step-form/update-step-form.component';
import { CreateStepFormComponent } from '../../../../ui/admin/steps/create-step-form/create-step-form.component';
import { CreatePromptsFormComponent } from '../../../../ui/admin/prompts/create-prompts-form/create-prompts-form.component';
import { of, Observable } from 'rxjs';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { CreateVariablesFormComponent } from '../../../../ui/admin/variables/create-variables-form/create-variables-form.component';
import { UpdateVariablesFormComponent } from '../../../../ui/admin/variables/update-variables-form/update-variables-form.component';
import { UpdatePromptsFormComponent } from '../../../../ui/admin/prompts/update-prompts-form/update-prompts-form.component';
import { CategoryModel } from '../../../../core/models/category.model';
import { CategoriesListComponent } from '../../../../ui/admin/categories/categories-list/categories-list.component';
import { FormsModule } from '@angular/forms';
import { ListboxModule, ListboxChangeEvent } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { MatCheckbox } from '@angular/material/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { LoaderService } from '../../../../shared/services/loader.service';

@Component({
  selector: 'app-step-admin-view',
  standalone: true,
  imports: [DatePipe, DialogModule, AsyncPipe],
  templateUrl: './step-admin-view.component.html',
  styleUrl: './step-admin-view.component.scss'
})
export class StepAdminViewComponent {

  stepsAdmin$: Observable<StepModelAdmin[]> = this.adminService.steps$;
  stepSelected!: StepModelAdmin;

  constructor(
    private adminService: AdminGateway,
    private dialog: Dialog,
    private confirmDialogService: ConfirmDialogService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.adminService.fetchSteps().subscribe();
    this.adminService.fetchCategories().subscribe();
  }

  openDialogSelectPlan(event: Event, step: StepModelAdmin) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(SelectPlansComponent, {
      width: 'auto',
      minWidth: '450px',
      maxWidth: '100%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var',
      data: { ...step }
    });
    dialogRef.closed.subscribe((result: any) => {
      if (!result) return;
      this.loaderService.setLoader(true)
      // update the Step.plans
      this.adminService.addPlansToStep(step.id, result).subscribe(
        data => this.loaderService.setLoader(false)
      );
    });
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

      // update the Step
      result.id = step.id;
      this.adminService.updateStep(result).subscribe();
    });
  }

  async openDialogCreatePrompt(ev: Event, step: StepModelAdmin) {
    ev.stopPropagation();

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

    });
  }

  async openDialogUpdatePrompt(ev: Event, step: StepModelAdmin) {
    ev.stopPropagation();

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

    });
  }

  async deleteStepAction(ev: Event, step: StepModelAdmin) {
    ev.stopPropagation();

    const isValid = await this.confirmDialogService.confirm(
      `Supprimer le step`,
      `Supprimer "${step.subtitle}" et toutes les données associées,
      y compris les prompts et les variables ?`
    );

    if (!isValid) return;
    this.adminService.deleteStep(step.id).subscribe();
  }

  openSelectCategoryDialog(ev: Event, prompt: PromptModelAdmin) {
    ev.stopPropagation();
    const dialogRef = this.dialog.open(SelectCategoryComponent, {
      width: 'auto',
      minWidth: '450px',
      maxWidth: '100%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var',
      data: { ...prompt }
    });
    dialogRef.closed.subscribe((result: any) => {
      if (!result) return;

    });
  }

  dissociateCategory(event: Event, prompt: PromptModelAdmin) {
    event.stopPropagation();
    if (!prompt.id) return;
    this.adminService.removeCategoryFromPrompt(prompt.id).subscribe();
  }

}




/**************************************
 * DialogComponent to select a variable
 **************************************/
@Component({
  selector: 'select-category-dialog',
  standalone: true,
  imports: [FormsModule, ListboxModule, JsonPipe],

  template: `
  <div style="background: #fff" class="p-2">
    <h3 class="mb-0 p-2 fs-6">Choisir une catégorie</h3>
      <p-listbox [options]="categories" 
       (onChange)="selectValue($event)"
       [style]="{'width':'100%'}"
       [listStyle]="{'max-height': '450px'}"></p-listbox>
  </div>

`,

  styles: [`
  .p-listbox .p-listbox-list .p-listbox-item {
    margin: 2px 0 !important;
    padding: 0rem 0rem !important;
    border: 0 none;
    color: #334155;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, outline-color 0.2s;
    border-radius: 4px;
  } 
  .p-listbox .p-listbox-list {
    margin: 0 !important; padding: 0 !important;
    padding-left: 0 !important;
  }
 
  .p-listbox .p-listbox-list .p-listbox-item {
    margin: 0;
    padding: 0.55rem 1.25rem;
    cursor: pointer;
    border-radius: 4px;
  }
  ul {
    padding-left: 0 !important;
  }
  `]
})

export class SelectCategoryComponent {

  categories: string[] = [];
  categoriesObj: CategoryModel[] = [];
  selectedCategory: string = 'variable1';

  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: PromptModelAdmin,
    public adminService: AdminGateway
  ) { }

  ngOnInit() {

    this.adminService.categories$.subscribe((categories: CategoryModel[]) => {
      this.categoriesObj = categories;
      this.categories = categories.map((catObj: any) => catObj.title);

    });
  }

  selectValue(event: ListboxChangeEvent) {
    const category = this.categoriesObj.find((cat: CategoryModel) => cat.title === event.value);


    if (this.data.id && category?.id) {
      this.adminService.addCategoryToPrompt(this.data.id, category.id)
        .subscribe((res) => this.dialogRef.close(res));
    }

  }
}


/**************************************
 * SelectPlansComponent to select plans
 **************************************/
@Component({
  selector: 'select-plans-dialog',
  standalone: true,
  imports: [FormsModule, CheckboxModule, JsonPipe, NgFor, ProgressBarModule],

  template: `
  <div style="background: #fff" class="p-2">
    <div class="mb-0 p-2 fs-6">
      <h3>{{step.title}}</h3>
    </div>

    <p-progressBar [style.opacity]="isLoading?1:0" mode="indeterminate"
    [style]="{ height: '3px',color:'#2c2b40' }"></p-progressBar>
      
    @if(!isLoading) {
    <div *ngFor="let plan of plans" class="field-checkbox">
      <p-checkbox
          [(ngModel)]="selectedPlans"
          [label]="plan.title" 
          name="group" 
          [value]="plan.id" />
    </div>
    <div class="d-flex justify-content-end my-2">
      <button (click)="dialogRef.close(selectedPlans)" class="btn btn-primary">Valider</button>
      <!-- <pre>{{selectedPlans | json}}</pre> -->
    </div>
    }
  </div>
  `,
  styles: [`
  .p-listbox .p-listbox-list .p-listbox-item {
    margin: 2px 0 !important;
    padding: 0rem 0rem !important;
    border: 0 none;
    color: #334155;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, outline-color 0.2s;
    border-radius: 4px;
  }
  .p-listbox .p-listbox-list {
    margin: 0 !important; padding: 0 !important;
    padding-left: 0 !important;
  }
  .p-listbox .p-listbox-list .p-listbox-item {
    margin: 0;
    padding: 0.55rem 1.25rem;
    cursor: pointer;
    border-radius: 4px;
  }
  ul {
    padding-left: 0 !important;
  }
  .field-checkbox {
    padding: 0.5rem 0.5rem;
  }
  `]
})
export class SelectPlansComponent {

  step: StepModelAdmin = {} as StepModelAdmin;
  plans: any[] = [];
  selectedPlans: any[] = [];
  selectedPlans$ = of(this.selectedPlans);

  isLoading = true;

  constructor(
    public dialogRef: DialogRef<any[]>,
    @Inject(DIALOG_DATA) public data: any,
    public adminService: AdminGateway
  ) { }

  ngOnInit() {

    this.selectedPlans$.subscribe((plans) => {
      console.log('CHANGE', plans);
    });

    this.step = this.data;
    this.adminService.plans$.subscribe((plans: any[]) => {
      this.plans = plans
      this.selectedPlans = this.step.plans?.map((plan: any) => plan.id)
      this.isLoading = false
      //.map((plan: any) => plan.title);
    });

    this.adminService.fetchPlans().subscribe();
  }

  selectValue(event: ListboxChangeEvent) {
    const plan = this.plans.find((plan: string) => plan === event.value);
    if (plan) {
      this.dialogRef.close(plan);
    }
  }

  isPlanBelongsToStep(planId: string) {
    return this.step.plans?.find((plan: any) => plan.id === planId);
  }
}