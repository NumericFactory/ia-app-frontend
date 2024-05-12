import { ControlType, FieldType } from "../../shared/services/question/question.model"

export interface FormUserSettingSchema {
    id?: number,
    key: string
    label: string
    controltype: ControlType
    type?: FieldType
    required: boolean
    information?: string
    order?: number,
}

export type UserSettingsModel = FormUserSettingSchema[];