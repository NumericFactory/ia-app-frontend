import { Component, Inject } from '@angular/core';
import { AdminGateway } from '../../../core/ports/admin.gateway';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { UserModel } from '../../../core/models/user.model';
import { DatePipe, JsonPipe } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { MatTabsModule } from '@angular/material/tabs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@Component({
  selector: 'app-user-detail-view',
  standalone: true,
  imports: [JsonPipe, ProgressBarModule, MatTabsModule, ScrollingModule, DatePipe, CdkAccordionModule],
  templateUrl: './user-detail-view.component.html',
  styleUrl: './user-detail-view.component.scss'
})
export class UserDetailViewComponent {

  user!: UserModel;
  userVariablesByStep: any = []
  isLoading = true;

  constructor(
    private adminService: AdminGateway,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    // get data from the dialog
    this.getUser(this.data.userId);
  }

  getUser(userId: number) {
    this.adminService.fetchUserById(userId, 'with=variables,prompts').subscribe(
      (user: UserModel) => {
        this.isLoading = false;
        this.user = user;
        this.userVariablesByStep = this.organizeVariablesByStepId(user.variables);

      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }


  /**
   * UTILS
   */
  organizeVariablesByStepId(data: any) {
    // Create a map to store variables by step_id
    const stepMap = new Map();
    // Iterate over the original data
    data.forEach((item: any) => {
      const stepId = item.step_id;

      // If the step_id is not already in the map, add it with an empty array
      if (!stepMap.has(stepId)) {
        stepMap.set(stepId, []);
      }

      // Push the current item to the appropriate step_id array
      stepMap.get(stepId).push(item);
    });

    // Convert the map to an array of objects with step_id and variables
    const result: any[] = [];
    stepMap.forEach((variables, step_id) => {
      result.push({ step_id, variables });
    });

    return result;
  }

}




