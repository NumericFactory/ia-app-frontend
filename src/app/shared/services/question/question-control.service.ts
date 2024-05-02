import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from './question.model';

@Injectable({
    providedIn: 'root'
})
export class QuestionControlService {

    toFormGroup(questions: QuestionBase<string>[]) {
        const group: any = {};

        questions.forEach(question => {
            group[question.variable_id!] = question.required ? new FormControl(question.value || '', Validators.required)
                : new FormControl(question.value || '');
            //group[question.key]['variable_id'] = question.variable_id;
        });
        return new FormGroup(group);
    }
}