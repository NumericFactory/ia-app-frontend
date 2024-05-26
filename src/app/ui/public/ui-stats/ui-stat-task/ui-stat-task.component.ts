import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-stat-task',
  standalone: true,
  imports: [],
  templateUrl: './ui-stat-task.component.html',
  styleUrl: './ui-stat-task.component.scss'
})
export class UiStatTaskComponent {

  @Input() completedStepPromptsTotalCount: number = 0;
  @Input() visibleStepPromptsTotalCount: number = 0;

  getPercatageProgression(): number {
    return Math.round(this.completedStepPromptsTotalCount / this.visibleStepPromptsTotalCount * 100);
  }

}
