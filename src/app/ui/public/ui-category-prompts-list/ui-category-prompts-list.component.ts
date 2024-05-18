import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { CategoryModel } from '../../../core/models/category.model';
import { PromptModel } from '../../../core/models/step.model';
import { StepGateway } from '../../../core/ports/step.gateway';
import { Router, RouterLink } from '@angular/router';
import { UserGateway } from '../../../core/ports/user.gateway';

@Component({
  selector: 'app-ui-category-prompts-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ui-category-prompts-list.component.html',
  styleUrl: './ui-category-prompts-list.component.scss'
})
export class UiCategoryPromptsListComponent {
  category!: CategoryModel
  prompts!: PromptModel[]

  constructor(
    public dialogRef: DialogRef<string>,
    private stepService: StepGateway,
    private router: Router,
    private userService: UserGateway,
    @Inject(DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log('data', this.data)
    this.category = this.data
    if (this.category?.id) {
      this.stepService.getPromptsByCategory(this.category.id).subscribe()
      this.stepService.prompts$.subscribe((prompts: any) => {
        this.prompts = prompts.data
        // set done to true if the prompt is already done
        let donePrompts = this.userService.getUserFromSubject()?.prompts;
        this.prompts.forEach((prompt: PromptModel) => {
          prompt.done = donePrompts?.find((donePrompt: PromptModel) => donePrompt.id === prompt.id) ? true : false
        })
      })
    }
  }

  navigateToPromptPage(prompt: PromptModel): void {
    this.dialogRef.close()
    this.router.navigate(['/dashboard/category', this.data.id, 'prompt', prompt.id])
  }

  close(): void {
    this.dialogRef.close();
  }

}
