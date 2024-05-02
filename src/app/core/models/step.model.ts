/* 
    CORE MODELS of business rules 
    Business rules are the rules that are specific to the business domain
    here we define what is
    - a Step
    - a Prompt
    - a User Variable

    A Step is a part of a process that the user has to complete
    A step contains : prompts and user variables
*/

import { ControlType, FieldType } from "../../shared/services/question/question.model"

export interface StepModel {
    id: number
    title: string
    subtitle: string
    desc: string
    prompts: PromptModel[]
    stepUservariables: StepUserVariableModel[]
    createdAt: string
    order: number
}
export interface StepUserVariableModel {
    id?: number
    stepId?: number
    key: string
    value?: string
}
export interface PromptModel {
    id: number
    stepId?: number
    title: string
    desc?: string
    categoryId?: number // category of the prompt
    order: number
}
export interface Category {
    id: number
    title: string
    desc: string
    order: number
}


/********* ADMIN **************/
export interface StepModelAdmin {
    id: number
    title: string
    subtitle: string
    desc: string
    variables: FormUISchema[]
    prompts: PromptModelAdmin[]
    createdAt: string
    order: number
}
export interface FormUISchema {
    id?: number,
    stepId?: number
    key: string
    label: string
    controltype: ControlType
    type?: FieldType
    required: boolean
    information?: string
    order?: number
}
export interface PromptModelAdmin {
    id?: number
    stepId?: number
    title: string
    desc?: string
    categoryId?: number // category of the prompt
    secretprompt: string // visible only by admin
    order: number
}

