import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[AutoResizeTextarea]',
  standalone: true
})
export class AutoResizeTextareaDirective {

  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor = '#fdfeff';
    el.nativeElement.style.fontSize = '15.5px';
    el.nativeElement.style.height = el.nativeElement.scrollHeight + 100 + 'px';
  }

}
