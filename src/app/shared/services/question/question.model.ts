export interface QuestionValidation {
  required: boolean;
  minLength: number;
  maxLength: number;
  pattern: string;
}

export class QuestionBase<T> {
  variable_id: number | null;
  value: T | undefined;
  key: string;
  label: string;
  controlType: string;
  type: string;
  required: boolean;
  information: string;
  order: number;
  selectOptions: { key: string, value: string }[];

  constructor(options: {
    variable_id?: number;
    value?: T;
    key?: string;
    label?: string;
    controlType?: ControlType;
    type?: FieldType;
    required?: boolean;
    information?: string;
    order?: number;
    options?: { key: string, value: string }[];
  } = {}) {
    this.variable_id = options.variable_id || null;
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.required = !!options.required;
    this.information = options.information || '';
    this.order = options.order === undefined ? 1 : options.order;
    this.selectOptions = options.options || [];
  }
}

export type ControlType = 'input' | 'select' | 'radio' | 'checkbox' | 'textarea';
export type FieldType = 'text' | 'number' | 'date' | 'email' | 'tel' | 'url' | 'color' | 'range' | 'file' | 'time' | 'datetime-local' | 'search' | 'hidden'