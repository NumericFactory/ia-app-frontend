export enum Role {
    user = 1,
    admin = 2,
    powerAdmin = 3,
    guest = 4
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
    prompts: any[]
}

