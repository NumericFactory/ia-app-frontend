import { Component, Inject } from '@angular/core';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Role, UserModel } from '../../../../core/models/user.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Dialog, DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UserDetailViewComponent } from '../../../../ui/admin/users/user-detail-view/user-detail-view.component';

import { ManageUserSettingsFormComponent } from '../../../../ui/admin/users/manage-user-settings-form/manage-user-settings-form.component';

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
    const dialogRef = this.dialog.open(ManageUserSettingsFormComponent, {
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
