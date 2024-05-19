import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';
import { UserGateway } from '../../../../core/ports/user.gateway';
import { AsyncPipe } from '@angular/common';
import { StepGateway } from '../../../../core/ports/step.gateway';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'ui-stat-circle',
  standalone: true,
  imports: [KnobModule, FormsModule, AsyncPipe],
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

  constructor(
    private stepService: StepGateway,
    private userService: UserGateway) { }

  ngOnInit(): void {

    combineLatest([this.user$, this.categories$]).subscribe(([user, categories]) => {
      console.log(user?.prompts);
      console.log(categories);
      user?.prompts?.forEach(prompt => {
        const category: any = categories.find(category => category.id === prompt.category_id);
        if (!category) return;
        category.count_done_prompts = 0; // rest value before counting
        category.count_done_prompts = category.count_done_prompts ? category.count_done_prompts + 1 : 1;
        // this.categoriesWithDoneCount = [category, ...this.categoriesWithDoneCount];
      });

    });
    this.categories$.subscribe(categories => {
      console.log(categories);
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
