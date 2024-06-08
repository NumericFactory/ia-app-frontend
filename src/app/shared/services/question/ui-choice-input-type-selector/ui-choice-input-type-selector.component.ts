import { NgFor } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
type InputType = string | 'shorttext' | 'longtext' | 'select' | 'number' | 'date' | 'url' | 'color' | 'range' | 'time' | 'datetime-local';

@Component({
  selector: 'ui-choice-input-type-selector',
  standalone: true,
  imports: [NgFor],
  templateUrl: './ui-choice-input-type-selector.component.html',
  styleUrl: './ui-choice-input-type-selector.component.scss'
})
export class UiChoiceInputTypeSelectorComponent {

  @Input() index !: number;
  @Input() controltype !: 'input' | 'select' | 'textarea';
  @Input() type !: InputType;
  @Output() selectedInputTypeEvent = new EventEmitter<any>();

  @ViewChild('selectTypeBoxHtmlElement') selectTypeBoxHtmlElement!: ElementRef;

  selectInputTypeBox = [
    { name: 'short text', value: 'text', icon: 'bi-paragraph' },
    { name: 'long text', value: 'longtext', icon: 'bi-paragraph' },
    { name: 'select', value: 'select', icon: 'bi-list' },
    { name: 'number', value: 'number', icon: 'bi-paragraph' },
    { name: 'date', value: 'date', icon: 'bi-calendar' },
    { name: 'url', value: 'url', icon: 'bi-link' },
    { name: 'color', value: 'color', icon: 'bi-palette' },
    { name: 'range', value: 'range', icon: 'bi-sliders' },
    { name: 'time', value: 'time', icon: 'bi-clock' },
    { name: 'datetime-local', value: 'datetime-local', icon: 'bi-calendar-event' }
  ];

  ngAfterViewInit() {

    console.log(this.selectTypeBoxHtmlElement);
    if (this.controltype === 'input') {
      this.selectTypeBoxHtmlElement.nativeElement.value = this.type;
    }
    else if (this.controltype === 'select') {
      this.selectTypeBoxHtmlElement.nativeElement.value = 'select';
    }
    else if (this.controltype === 'textarea') {
      this.selectTypeBoxHtmlElement.nativeElement.value = 'longtext';
    }

  }



  /**
  * selectInputTypeAction
  *  - set settingsForm controltype: 'input' | 'select' | 'textarea'
  *  - set settingsForm line type: InputType
  * @param value: InputType
  * @param index: number
  */
  selectInputTypeAction(value: InputType, index: number) {
    this.selectedInputTypeEvent.emit({ value, index });
  }

}
