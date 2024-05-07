import { Observable, ObservableInput } from "rxjs";
import { UserModel } from "../models/user.model";

export interface CreateUserPromptAiReturnDTO {
    prompt: {
        ia_response: string,
        ia_name?: string | null,
        ia_model?: string | null,
        tokens_count_input?: number | null,
        tokens_count_output?: number | null
    }
}

export interface CreateUserPromptAiReturnResponseDTO {
    id: number,
    step_id: number,
    ia_response: string
    created_at: string
    updated_at: string
}

// UserGateway interface contract
export abstract class UserGateway {

    // observable for user with variables value & prompts ia_response
    abstract user$: Observable<UserModel | null>;

    // get static user or null
    abstract getUserFromSubject(): UserModel | null;
    abstract setUserSubject(user: UserModel): void;

    // helper methods
    abstract fetchUserVariables(): Observable<UserModel>
    abstract postStepUserVariables(stepId: number, payloadUserVar: any): Observable<any>
    abstract fetchUserPrompts(): Observable<any>
    abstract postUserPromptAIResponse(stepId: number, promptId: number, payloadAIResponse: CreateUserPromptAiReturnDTO): Observable<CreateUserPromptAiReturnResponseDTO>

}