import { Observable, ObservableInput } from "rxjs";
import { UserModel } from "../models/user.model";

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

}