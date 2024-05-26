import { Component, Inject } from '@angular/core';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { AsyncPipe, DatePipe, JsonPipe, CommonModule, NgIf } from '@angular/common';
import { Role, UserModel } from '../../../../core/models/user.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Dialog, DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogService } from "../../../../shared/services/confirm-dialog.service";
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UserDetailViewComponent } from '../../../../ui/admin/user-detail-view/user-detail-view.component';
import { CdkDragDrop, CdkDragHandle, CdkDragPlaceholder, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-users-admin-view',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, DatePipe, DialogModule],
  templateUrl: './users-admin-view.component.html',
  styleUrl: './users-admin-view.component.scss'
})
export class UsersAdminViewComponent {

  Role = Role;

  // get the users by role
  guests: UserModel[] = [];
  users: UserModel[] = [];
  admins: UserModel[] = [];
  // all Users for search
  allUsers: UserModel[] = [];
  // all users for print in HTML view
  printUsers: UserModel[] = [];

  rolesList = [
    { title: 'User', value: Role.user },
    { title: 'Admin', value: Role.admin },
    { title: 'Power Admin', value: Role.powerAdmin }
  ]

  // inject the admin service
  constructor(
    private adminService: AdminGateway,
    private dialog: Dialog,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit() {

    // fetch the users
    this.adminService.fetchUsers().subscribe();

    // sort users by role
    this.adminService.users$.subscribe((users: UserModel[]) => {
      this.users = users.filter((user: UserModel) =>
        user.roles.includes(Role.user)
        && !user.roles.includes(Role.admin)
        && !user.roles.includes(Role.powerAdmin));
      this.admins = users.filter((user: UserModel) =>
        user.roles.includes(Role.admin)
        || user.roles.includes(Role.powerAdmin));
      this.guests = users.filter((user: UserModel) =>
        !user.roles.includes(Role.user)
        && !user.roles.includes(Role.admin)
        && !user.roles.includes(Role.powerAdmin));
      // all users
      this.allUsers = [...this.admins, ...this.users, ...this.guests];
      this.printUsers = [...this.allUsers];

    });

  } // end ngOnInit


  // update the role of the user
  openRoleDialog(event: Event, user: UserModel): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(RoleDialog, {
      width: 'auto',
      minWidth: '350px',
      maxWidth: '100%',
      data: { ...user }
    });

    dialogRef.closed.subscribe((result: any) => {
      // get the selected roles
      if (!result) return;
      const justSelectedRoles: any[] = Object.entries(result).map(([key, value]: any[]) => {
        return value ? Role[key] : null;
      }).filter((role: any) => role !== null);
      // update the user role
      this.adminService.setRoles(user.id, justSelectedRoles);
    });
  }

  // searchUser input
  searchUser(searchText: string) {
    if (!searchText) {
      this.printUsers = this.allUsers;
      return;
    }
    searchText = searchText.trim().toLowerCase();
    this.printUsers = this.allUsers.filter((user: UserModel) => {
      return user.firstname.toLowerCase().includes(searchText)
        || user.lastname.toLowerCase().includes(searchText)
        || user.email.toLowerCase().includes(searchText)
        || user.phone.toLowerCase().includes(searchText);
    });

  }

  openDialogManageUserSettings() {
    // ev.stopPropagation();
    const dialogRef = this.dialog.open(DialogManageUserSettings, {
      disableClose: true,
      width: 'auto',
      minWidth: '900px',
      maxWidth: '100%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var',
      // data: { ...step } as StepModelAdmin
    });

    dialogRef.closed.subscribe((result: any) => {
      // get the selected roles
      if (!result) return;
      // update the user role
      //this.adminService.setRoles(user.id, justSelectedRoles);
    });
  }


  openDialogUserDetail(event: Event, userId: number): void {
    this.bottomSheet.open(UserDetailViewComponent, {

      //disableClose: true,
      //width: '100%',
      //minWidth: '320px',
      //maxWidth: '750px',
      //height: '95%',
      //closeOnNavigation: true,
      panelClass: 'bottomsheet-admin-user-view',
      data: { userId },

    });
  }

}






@Component({
  selector: 'ui-admin-role-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule, MatButtonModule],
  template: `
  <h3>{{data.firstname}} {{data.lastname}}</h3>
   <form [formGroup]="roles">
      <p class="m-0"><mat-checkbox formControlName="user">User</mat-checkbox></p>
      <p class="m-0"><mat-checkbox formControlName="admin">Admin</mat-checkbox></p>
      <p class="m-0"><mat-checkbox formControlName="powerAdmin">PowerAdmin</mat-checkbox></p>
      <div class="d-flex justify-content-end">
        <button mat-button (click)="dialogRef.close()">Annuler</button>
        <button mat-button color="primary" (click)="dialogRef.close(roles.value)">Valider</button>
      </div>
  </form>
  `,
  styles: [`:host {
    display: block;
    background: #fff;
    border-radius: 8px;
    padding: 8px 16px 16px;
  }
  
  input {
    margin: 8px 0;
  }
  
  button + button {
    margin-left: 8px;
  } `]
})
export class RoleDialog {

  Role = Role;
  roles!: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.roles = this.formBuilder.group({
      user: this.data.roles.includes(Role.user),
      admin: this.data.roles.includes(Role.admin),
      powerAdmin: this.data.roles.includes(Role.powerAdmin),
    });
  }


}





@Component({
  selector: 'ui-create-settings-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatCheckboxModule,
    DragDropModule, CdkDragHandle, CdkDragPlaceholder,
    JsonPipe, NgIf,
    MatButtonModule, CommonModule,

  ],
  template: `
  <h3 class="fs-5">Settings utilisateur</h3>
  <i (click)="closeDialog()" class="bi bi-x-lg close-dialog-btn"></i>

  <!-- info text -->
  <p class="text-secondary info-text">
    <i class="bi bi-info-circle-fill text-primary"></i>
    valider pour sauvegarder les questions
  </p>
  <hr>

  <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()">

  <!-- DRAG AND DROP -->
  <div id="list-parent-iterator" cdkDropList [cdkDropListData]="questions['controls']"
            (cdkDropListDropped)="drop($event)">

    <!-- ITERATE OVER THE QUESTIONS -->
    @for(item of formData.controls; track item; let i = $index, c=$count) {
    <div id="list-sub-parent-iterator" cdkDrag [cdkDragLockAxis]="'y'" [cdkDragData]="item" 
    formArrayName="settings">

      <div class="example-custom-placeholder" *cdkDragPlaceholder></div>
      <!-- LIGNE DE QUESTION -->
      <div class="line" [formGroupName]="i">
       <!-- <span>{{i+1}}</span> -->
        <div class="row mb-4">
          <div class="py-3 col-1 d-flex align-items-center justify-content-between">
            <!-- required -->
            <div><input class="form-check-input ms-2" type="checkbox" formControlName="required"></div>
            <!-- remove item -->
            <button type="button" class="btn btn-link fs-3 p-0 m-0 text-secondary" (click)="removeQuestionItem(i)" title="Supprimer la ligne">
              <i class="bi bi-x"></i>
            </button>
            <!-- handle drag and drop reorder -->
            <div class="example-handle" cdkDragHandle>
              <svg width="24px" fill="currentColor" viewBox="0 0 24 24">
                  <path
                      d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z">
                  </path>
                  <path d="M0 0h24v24H0z" fill="none"></path>
              </svg>
            </div>
          </div>

          <div class="col-11">
            <div class="row gx-2 gy-1">

              <!-- input key -->
              <div class="col-3"><input class="form-control" formControlName="key" placeholder="key"></div>
              <!-- input label -->
              <div class="col-3"><input class="form-control" formControlName="label" placeholder="label"></div>
              <!-- select controle type -->
              <div class="col-3">
                <select class="form-control" formControlName="controltype">
                  <option value="input">input</option>
                  <option value="textarea">textarea</option>
                  <option disabled value="select">select</option>
                </select>
              </div>
              <!-- select type -->
              <div class="col-3">
                <select class="form-control" formControlName="type">
                  <option value="text">text</option>
                  <option value="number">number</option>
                  <option value="date">date</option>
                  <option value="url">url</option>
                  <option value="color">color</option>
                  <option value="range">range</option>
                  <option value="time">time</option>
                  <option value="datetime-local">datetime-local</option>
                </select>
              </div>
              <!-- textarea information -->
              <div class="col-12"><textarea placeholder="informations" class="form-control" formControlName="information"></textarea></div>
            
            </div><!-- end row -->
          </div><!-- end col -->
        
        </div><!-- end row -->
      </div> <!-- end line -->
  </div> <!-- end formArrayName -->
}

  </div> <!-- end cdkDropList -->

  <!-- BOUTON AJOUTER UNE QUESTION-->
  <div class="form-group d-flex justify-content-center">
    <button class="btn btn-sm btn-secondary" type="button" (click)="addQuestionItem()">Ajouter une question</button>
  </div>
  <hr>
  <!-- BOUTON VALIDER -->
  <div class="d-flex justify-content-end">
    <button mat-button type="button" (click)="dialogRef.close()">Annuler</button>
    <button class="btn btn-primary" type="submit">Valider {{formData.controls.length}}</button>
  </div>
     
  </form>
  `,
  styles: [`:host {
    display: block;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 8px 16px 16px;
  }

  p.info-text {
    font-size: 0.925rem;
    i {
      font-size: 1rem;
      margin-right: 5px;
    }
  }

  .alert {
    margin-top: 0.5rem;
    padding: 0.5rem;
    font-size: 0.875rem;
}
  
  input, select {
    margin: 4px 0;
  }
  
  button + button {
    margin-left: 8px;
  } 
  form input.form-control, form select.form-control, form textarea.form-control {
    padding: 0.325rem 0.65rem;
  }
  .cdk-drag-animating {
    transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
  }
  .example-box:last-child {
      border: none;
  }
  .example-custom-placeholder {
      background: #f8f9faaa;
      border: dotted 3px lightblue;
      min-height: 100px;
      width: 100%;
      display: block;
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
  }
  `]
})
export class DialogManageUserSettings {

  settingsForm !: FormGroup;
  questions!: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
    private adminService: AdminGateway,
    private confirmDialog: ConfirmDialogService
  ) { }

  drop(event: CdkDragDrop<any>) {
    const dir = event.currentIndex > event.previousIndex ? 1 : -1;
    const from = event.previousIndex;
    const to = event.currentIndex;
    const temp = this.questions.at(from);
    for (let i = from; i * dir < to * dir; i = i + dir) {
      const current = this.questions.at(i + dir);
      this.questions.setControl(i, current);
    }
    this.questions.setControl(to, temp);

    this.settingsForm.value.settings.forEach((question: any, index: number) => {
      question.order = index + 1;
    });

    console.log(this.settingsForm.value.settings);
  }

  // Permet de récupérer formPrompts dans la vue qui est une instance de FormArray
  get formSettings() {
    return <FormArray>this.settingsForm.get('settings');
  }

  ngOnInit() {

    // build the form
    this.settingsForm = this.formBuilder.group({
      settings: this.formBuilder.array([this.createQuestionFormControl()]),
    });
    // set the form value
    this.adminService.getUserParametersFields().subscribe((fields) => {
      this.settingsForm = this.formBuilder.group({
        settings: this.formBuilder.array(fields.map((field: any) => this.formBuilder.group(field))),
      });
      this.questions = this.settingsForm.get('settings') as FormArray;
    });
  }

  getUser(userId: number) {
    this.adminService.fetchUserById(userId).subscribe();
  }

  // Permet de créer un QuestionForm à la volée
  createQuestionFormControl(): FormGroup {
    return this.formBuilder.group({
      key: ['', Validators.required],
      label: ['', Validators.required],
      controltype: 'input',
      type: 'text',
      required: true,
      information: '',
      order: 1
    });
  }

  // Au clic de l'utilisateur sur le bouton "Ajouter une ligne"
  addQuestionItem(): void {
    this.questions = this.settingsForm.get('settings') as FormArray;
    this.questions.push(this.createQuestionFormControl());
    this.questions.controls.forEach((control, index) => {
      control.get('order')?.setValue(index + 1);
    });
  }

  // Au clic de l'utilisateur sur le bouton "Supprimer la ligne"
  async removeQuestionItem(index: number) {
    const deleteIsConfirmed = await this.confirmDialog.confirm('Supprimer', 'Attention! vous vous apprêtez à supprimer cette question. Confirmer ?');
    if (!deleteIsConfirmed) return;
    if (this.settingsForm.value.settings[index].id) {
      this.adminService.deleteUserSettings(this.settingsForm.value.settings[index].id).subscribe();
    }
    this.questions = this.settingsForm.get('settings') as FormArray;
    this.questions.removeAt(index);
    this.questions.controls.forEach((control: any, index: any) => {
      control.get('order')?.setValue(index + 1);
    });
    if (this.questions.length === 0) {
      this.dialogRef.close();
    }
  }

  // Permet de récupérer formData dans la vue qui est une instance de FormArray
  get formData() {
    return <FormArray>this.settingsForm.get('settings');
  }

  onSubmit() {
    console.log(this.settingsForm.value);
    if (this.settingsForm.invalid) return;
    this.adminService.createOrUpdateUserSettings(this.settingsForm.value)
      .subscribe(() => this.dialogRef.close());
  }

  closeDialog() {
    this.dialogRef.close();
  }


}
