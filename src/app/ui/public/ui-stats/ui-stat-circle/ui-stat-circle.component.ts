import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';

@Component({
  selector: 'ui-stat-circle',
  standalone: true,
  imports: [KnobModule, FormsModule],
  templateUrl: './ui-stat-circle.component.html',
  styleUrl: './ui-stat-circle.component.scss'
})
export class StatCircleComponent {

  @Input() label: string = 'Label';
  @Input() value: number = 50;
  @Input() max: number = 127;
  @Input() min?: number = 0;
}
