import { Component, Input } from '@angular/core';
import { StepModel } from '../../../core/models/step.model';
import { RouterLink } from '@angular/router';
import { MeterGroupModule } from 'primeng/metergroup';
import { NgFor } from '@angular/common';

@Component({
  selector: 'ui-step-card',
  standalone: true,
  imports: [RouterLink, MeterGroupModule, NgFor],
  templateUrl: './ui-step-card.component.html',
  styleUrl: './ui-step-card.component.scss'
})
export class UiStepCardComponent {

  @Input() step!: StepModel
  value = [
    { label: 'Prompt', color: 'rgb(39 200 185)', value: 21, icon: 'bi bi-terminal' }
  ];

}
