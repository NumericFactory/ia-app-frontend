import { Observable, ObservableInput } from "rxjs";
import { Role, UserModel } from "../models/user.model";
import { FormUISchema, PromptModelAdmin, StepModelAdmin } from "../models/step.model";
import { UserSettingsModel } from "../models/user-settings.model";
import { CategoryModel } from "../models/category.model";

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
    abstract categories$: Observable<CategoryModel[]>;
    //abstract prompts$: Observable<PromptModelAdmin[]>;

    // get user or null
    abstract fetchUsers(): Observable<UserModel[]>;
    abstract fetchUserById(id: number, queryString?: string): Observable<UserModel>;

    // roles management methods
    abstract fetchRoles(): Observable<Role[] | number[]>;
    abstract setRoles(userId: number, roles: Role[] | number[]): void;

    // step and prompt management methods
    abstract fetchSteps(): Observable<StepModelAdmin[]>;
    abstract createStep(step: StepModelAdmin): Observable<StepModelAdmin>;
    abstract updateStep(step: StepModelAdmin): Observable<StepModelAdmin>;
    abstract deleteStep(id: number): Observable<number>;
    abstract setStepVisibility(id: number, isVisible: boolean): Observable<number>;

    abstract fetchPrompts(stepId: number): Promise<PromptModelAdmin[]>;
    abstract createPrompts(prompt: PromptModelAdmin[], stepId: number): Observable<any>;
    abstract updatePrompts(prompt: PromptModelAdmin[], stepId: number): Observable<any>;
    abstract deletePrompt(id: number): Observable<void>;

    abstract createVariables(variables: FormUISchema[], stepId: number): Observable<any>;
    abstract updateVariables(variable: FormUISchema[], stepId: number): Observable<any>;
    abstract deleteVariable(id: number): Observable<any>;

    abstract getUserParametersFields(): Observable<any>;
    abstract createOrUpdateUserSettings(settings: UserSettingsModel): Observable<any>;
    abstract deleteUserSettings(id: number): Observable<any>;

    abstract fetchCategories(): Observable<CategoryModel[]>;
    abstract createCategory(category: Omit<CategoryModel, 'id'>): Observable<any>;
    abstract updateCategory(id: number, category: CategoryModel): Observable<any>;
    abstract deleteCategory(id: number): Observable<any>;

    abstract addCategoryToPrompt(promptId: number, categoryId: number): Observable<any>;
    abstract removeCategoryFromPrompt(promptId: number): Observable<any>;

    abstract setSignupPageVisibility(isVisible: boolean): Observable<any>;

}
