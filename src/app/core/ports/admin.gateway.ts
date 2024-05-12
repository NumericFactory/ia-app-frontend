import { Observable, ObservableInput } from "rxjs";
import { Role, UserModel } from "../models/user.model";
import { FormUISchema, PromptModelAdmin, StepModelAdmin } from "../models/step.model";
import { UserSettingsModel } from "../models/user-settings.model";

export type ResponseMessage = { message: string }

export type registerUserPayload = {
    firstname: string
    lastname: string
    phone: string
    email: string
    password: string
}

export type loginUserPayload = {
    email: string
    password: string
}

// AdminGateway interface contract
export abstract class AdminGateway {

    // observables for user and auth status
    abstract users$: Observable<UserModel[]>;
    abstract steps$: Observable<StepModelAdmin[]>;
    //abstract prompts$: Observable<PromptModelAdmin[]>;

    // get user or null
    abstract fetchUsers(): Observable<UserModel[]>;
    abstract fetchUserById(id: string): Observable<UserModel>;

    // roles management methods
    abstract fetchRoles(): Observable<Role[] | number[]>;
    abstract setRoles(userId: number, roles: Role[] | number[]): void;

    // helper methods

    // step and prompt management methods
    abstract fetchSteps(): Observable<StepModelAdmin[]>;
    abstract createStep(step: StepModelAdmin): Observable<StepModelAdmin>;
    abstract updateStep(step: StepModelAdmin): Observable<StepModelAdmin>;
    abstract deleteStep(id: number): Observable<number>;

    abstract fetchPrompts(stepId: number): Promise<PromptModelAdmin[]>;
    abstract createPrompts(prompt: PromptModelAdmin[], stepId: number): Observable<any>;
    abstract updatePrompts(prompt: PromptModelAdmin[], stepId: number): Observable<any>;
    abstract deletePrompt(id: number): Observable<void>;

    abstract createVariables(variables: FormUISchema[], stepId: number): Observable<any>;
    abstract updateVariables(variable: FormUISchema[], stepId: number): Observable<any>;
    abstract deleteVariable(id: number): Observable<any>;

    abstract createUserSettings(settings: UserSettingsModel): Observable<any>;
    //abstract UpdateUserSettings(settings: UserSettingsModel): Observable<any>;
    //abstract deleteUserSetting(id: number): Observable<any>;


}
