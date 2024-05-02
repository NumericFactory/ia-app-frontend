import { Component, Input } from '@angular/core';
import { StepModel } from '../../../core/models/step.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ui-step-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ui-step-card.component.html',
  styleUrl: './ui-step-card.component.scss'
})
export class UiStepCardComponent {

  @Input() step!: StepModel

}
