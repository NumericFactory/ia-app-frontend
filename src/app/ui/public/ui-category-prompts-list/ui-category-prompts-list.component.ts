import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CategoryModel } from '../../../core/models/category.model';
import { PromptModel } from '../../../core/models/step.model';
import { StepGateway } from '../../../core/ports/step.gateway';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-category-prompts-list',
  standalone: true,
  imports: [TableModule, NgFor],
  templateUrl: './ui-category-prompts-list.component.html',
  styleUrl: './ui-category-prompts-list.component.scss'
})
export class UiCategoryPromptsListComponent {
  category!: CategoryModel
  prompts!: PromptModel[]

  constructor(
    public dialogRef: DialogRef<string>,
    private stepService: StepGateway,
    @Inject(DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log('data', this.data)
    this.category = this.data
    if (this.category?.id) {
      this.stepService.getPromptsByCategory(this.category.id).subscribe()
      this.stepService.prompts$.subscribe((prompts: any) => {

        this.prompts = prompts.data
      })
    }

  }

  close(): void {
    this.dialogRef.close();
  }

}
