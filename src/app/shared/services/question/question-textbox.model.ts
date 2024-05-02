import { QuestionBase } from './question.model';

export class ShortTextboxQuestion extends QuestionBase<string> {
  override controlType = 'input';
  override type = 'text';
}

export class LongTextboxQuestion extends QuestionBase<string> {
  override controlType = 'textarea';
  override type = '';
}

export class NumberTextboxQuestion extends QuestionBase<number> {
  override controlType = 'input';
  override type = 'number';
}

export class DateTextboxQuestion extends QuestionBase<string> {
  override controlType = 'input';
  override type = 'date';
}

export class EmailTextboxQuestion extends QuestionBase<string> {
  override controlType = 'input';
  override type = 'email';
}

export class TelTextboxQuestion extends QuestionBase<string> {
  override controlType = 'input';
  override type = 'tel';
}

export class UrlTextboxQuestion extends QuestionBase<string> {
  override controlType = 'input';
  override type = 'url';
}

export class ColorTextboxQuestion extends QuestionBase<string> {
  override controlType = 'input';
  override type = 'color';
}

export class RangeTextboxQuestion extends QuestionBase<number> {
  override controlType = 'input';
  override type = 'range';
}

export class TimeTextboxQuestion extends QuestionBase<string> {
  override controlType = 'input';
  override type = 'time';
}

export class DateTimeLocalTextboxQuestion extends QuestionBase<string> {
  override controlType = 'input';
  override type = 'datetime-local';
}

export class SelectQuestion extends QuestionBase<string> {
  override controlType = 'select';
  override type = '';
  // constructor(options: { 
  //   value?: string; 
  //   key?: string; 
  //   label?: string; 
  //   required?: boolean; 
  //   order?: number; 
  //   options?: { key: string, value: string }[] } = {}) {
  //     super(options);
  //   }
}

