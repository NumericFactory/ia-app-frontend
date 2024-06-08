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
import { CategoryModel } from "./category.model"

export interface StepModel {
    id: number
    title: string
    subtitle: string
    desc: string
    prompts: PromptModel[]
    stepUservariables: StepUserVariableModel[]
    createdAt: string
    order: number
    isVisible: boolean
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
    categoryId?: number,
    category?: CategoryModel // category of the prompt
    title: string
    desc?: string
    order: number
    secretprompt?: string // visible only by admin
    createdAt: string
    updatedAt: string
    done?: boolean
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
    isVisible: boolean
}
export interface FormUISchema {
    id?: number,
    stepId?: number
    key: string
    label: string
    controltype: ControlType
    selectOptions?: string
    type?: FieldType
    required: boolean
    information?: string
    order?: number,
    is_usersetting?: boolean
}
export interface PromptModelAdmin {
    id?: number
    stepId?: number
    categoryId?: number,
    category?: CategoryModel // category of the prompt
    title: string
    desc?: string
    secretprompt: string // visible only by admin
    order: number
}

