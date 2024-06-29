import { Component, Input } from '@angular/core';
import { StepModel } from '../../../core/models/step.model';
import { RouterLink } from '@angular/router';
import { MeterGroupModule } from 'primeng/metergroup';
import { NgFor } from '@angular/common';
import { UserHistoryModel } from '../../../core/models/user.model';

@Component({
  selector: 'ui-step-card',
  standalone: true,
  imports: [RouterLink, MeterGroupModule, NgFor],
  templateUrl: './ui-step-card.component.html',
  styleUrl: './ui-step-card.component.scss'
})
export class UiStepCardComponent {

  @Input() step!: StepModel
  @Input() userHistory!: UserHistoryModel
  completedStepPrompts = 0;

  value = [
    { label: 'Prompt', color: 'rgb(39 200 185)', value: 0, icon: 'bi bi-terminal' }
  ];

  ngOnInit(): void {
    this.userHistory = this.userHistory || []
    // count the number of prompts that have been completed
    this.completedStepPrompts = this.userHistory.find(
      (story) => story.step_id === this.step.id
    )?.prompts.length || 0;
    this.value = [
      {
        label: 'Prompt',
        color: 'rgb(39 200 185)',
        value: (this.completedStepPrompts / this.step.prompts.length) * 100,
        icon: 'bi bi-terminal'
      }
    ];
  }

}
