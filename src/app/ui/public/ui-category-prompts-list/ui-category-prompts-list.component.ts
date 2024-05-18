import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { CategoryModel } from '../../../core/models/category.model';
import { PromptModel } from '../../../core/models/step.model';
import { StepGateway } from '../../../core/ports/step.gateway';
import { Router, RouterLink } from '@angular/router';
import { UserGateway } from '../../../core/ports/user.gateway';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, startWith } from 'rxjs';

@Component({
  selector: 'app-ui-category-prompts-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './ui-category-prompts-list.component.html',
  styleUrl: './ui-category-prompts-list.component.scss'
})
export class UiCategoryPromptsListComponent {
  category!: CategoryModel
  prompts!: PromptModel[]
  promptsFiltered!: PromptModel[]

  filterByPromptControl: FormControl = new FormControl()
  doneControl: FormControl = new FormControl()
  todoControl: FormControl = new FormControl()

  search$ = combineLatest([
    this.filterByPromptControl.valueChanges.pipe(startWith('')),
    this.doneControl.valueChanges.pipe(startWith(true)),
    this.todoControl.valueChanges.pipe(startWith(true))
  ])




  constructor(
    public dialogRef: DialogRef<string>,
    private stepService: StepGateway,
    private router: Router,
    private userService: UserGateway,
    @Inject(DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log('data', this.data)
    this.filterByPromptControl.setValue('')
    this.doneControl.setValue(true)
    this.todoControl.setValue(true)
    this.category = this.data
    if (this.category?.id) {
      this.stepService.getPromptsByCategory(this.category.id).subscribe()
      this.stepService.prompts$.subscribe((prompts: any) => {
        console.log('prompts', prompts)
        if (!prompts.data) return;

        this.prompts = prompts.data
        console.log('THIS.prompts', this.prompts)
        // set done to true if the prompt is already done
        let donePrompts = this.userService.getUserFromSubject()?.prompts;
        this.prompts.forEach((prompt: PromptModel) => {
          prompt.done = donePrompts?.find((donePrompt: PromptModel) => donePrompt.id === prompt.id) ? true : false

          this.search$.subscribe(([filterByPrompt, done, todo]) => {
            console.log('filterByPrompt', filterByPrompt)
            console.log('done', done)
            console.log('todo', todo)
            this.promptsFiltered = this.prompts.filter((prompt: PromptModel) => {
              const matchesText = prompt.title.toLowerCase().includes(filterByPrompt.toLowerCase());
              const matchesDone = done && prompt.done;
              const matchesTodo = todo && !prompt.done;
              return matchesText && (matchesDone || matchesTodo);
            })
          })

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
