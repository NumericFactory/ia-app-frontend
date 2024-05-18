import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appSetCursorPosition]',
  standalone: true
})
export class SetCursorPositionDirective implements OnChanges {

  @Input() cursorPosition!: number;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if ('cursorPosition' in changes)
      this.setPosition(this.cursorPosition);
  }

  private setPosition(position: number) {
    const textarea = this.el.nativeElement;
    if (textarea.setSelectionRange) {
      textarea.setSelectionRange(position, position);
    } else if (textarea.createTextRange) {
      const range = textarea.createTextRange();
      range.collapse(true);
      range.moveEnd('character', position);
      range.moveStart('character', position);
      range.select();
    }
    textarea.focus();
  }

}
