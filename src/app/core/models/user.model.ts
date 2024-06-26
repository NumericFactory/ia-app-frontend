export enum Role { user = 1, admin = 2, powerAdmin = 3, guest = 4 }

export interface UserHistoryPromptItemModel {
    prompt_id: number,
    prompt_title: string,
    ia_response: string
    created_at: string
}

export interface UserHistoryItemModel {
    step_id: number,
    step_title: string,
    prompts: UserHistoryPromptItemModel[]
}

export type UserHistoryModel = UserHistoryItemModel[]

export interface userSettings {
    id?: number
    label: string
    key: string
    value?: string
}

export interface UserModel {
    id: number
    createdAt: string
    firstname: string
    lastname: string
    phone: string
    email: string
    roles: number[] | Role[]
    variables: any[],
    prompts?: any[],
    plans: any[],
    settings: userSettings[],
    history?: UserHistoryModel
}

