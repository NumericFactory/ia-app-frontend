import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgSwitchCase } from '@angular/common';
import { QuestionBase } from '../question.model';
import { InputTextareaModule } from 'primeng/inputtextarea';



@Component({
  standalone: true,
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html',
  imports: [CommonModule, ReactiveFormsModule, CommonModule, InputTextareaModule, NgSwitchCase],
})
export class DynamicFormQuestionComponent {

  @Input() question!: QuestionBase<string>;
  @Input() form!: FormGroup;
  @Input() isFormSubmitted: boolean = false;
  selectOptions: { value: string, name: string }[] = [];

  ngOnInit() {
    console.log('question', this.question);
    console.log('form', this.form);
    // if (this.question.controlType === 'select') {
    //   this.selectOptions = this.question.selectOptions?.split(',').map((option: string) => {
    //     return { value: option, name: option };
    //   }) || [];
    // }

  }


  // champ invalide si le champ est invalide ET qu'il a été modifié ou le formulaire a été soumis
  get isInvalid() {
    return this.form.controls[this.question.variable_id!].invalid && this.form.controls[this.question.variable_id!].dirty
      || this.form.controls[this.question.variable_id!].invalid && this.isFormSubmitted;
  }
}
