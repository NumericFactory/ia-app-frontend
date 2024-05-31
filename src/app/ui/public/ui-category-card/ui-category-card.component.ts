import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-category-card',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './ui-category-card.component.html',
  styleUrl: './ui-category-card.component.scss'
})
export class UiCategoryCardComponent {

  @Input() title: string = '';
  @Input() promptcount: number = 0;
  @Input() icon?: string = '/assets/images/light.png';

  pluralize(count: number, word: string): string {
    return count <= 1 ? word : word + 's';
  }

  ngOnInit() {
    if (!this.icon) {
      this.icon = '/assets/images/light.png';
    }
  }
}
