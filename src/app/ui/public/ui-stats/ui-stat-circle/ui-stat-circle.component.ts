import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';
import { UserGateway } from '../../../../core/ports/user.gateway';
import { AsyncPipe } from '@angular/common';
import { StepGateway } from '../../../../core/ports/step.gateway';
import { combineLatest } from 'rxjs';
import { UiStatTaskComponent } from '../ui-stat-task/ui-stat-task.component';

@Component({
  selector: 'ui-stat-circle',
  standalone: true,
  imports: [KnobModule, FormsModule, AsyncPipe, UiStatTaskComponent],
  templateUrl: './ui-stat-circle.component.html',
  styleUrl: './ui-stat-circle.component.scss'
})
export class StatCircleComponent {

  @Input() label: string = 'Label';
  @Input() value: number = 50;
  @Input() max: number = 127;
  @Input() min?: number = 0;

  user$ = this.userService.user$;
  categories$ = this.stepService.categories$;
  categoriesWithDoneCount: any[] = [];

  constructor(
    private stepService: StepGateway,
    private userService: UserGateway) { }

  ngOnInit(): void {

    combineLatest([this.user$, this.categories$]).subscribe(([user, categories]) => {
      const updatedCategories = categories.map(category => { return { ...category, count_done_prompts: 0 } });
      user?.prompts?.forEach(prompt => {
        const category: any = updatedCategories.find(category => category.id === prompt.category_id);
        if (!category) return;
        category.count_done_prompts = category.count_done_prompts ? category.count_done_prompts + 1 : 1;
      });
      this.categoriesWithDoneCount = [...updatedCategories];
      console.log('UPDATED CATS: ', this.categoriesWithDoneCount);
    });
  }

  truncate(str: string): string {
    let truncateStr = str.slice(0, 8); // "The quick brown f"
    if (str.length > 8) {
      truncateStr = truncateStr + '...';
    }
    return truncateStr;
  }

}
