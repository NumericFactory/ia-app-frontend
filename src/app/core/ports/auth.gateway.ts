import { Observable } from "rxjs";
import { UserModel } from "../models/user.model";
import { HttpRequest } from "@angular/common/http";
import { PromptModel, StepModel } from "../models/step.model";

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

// AuthGateway interface contract
export abstract class AuthGateway {

    // observables for user and auth status
    abstract user$: Observable<UserModel | null>;
    abstract isAuth$: Observable<boolean>;

    // get user or null
    abstract getUser(): Promise<UserModel | null>;
    abstract getUserFromSubject(): UserModel | null;

    // auth methods
    abstract register(user: registerUserPayload): Observable<ResponseMessage>;
    abstract validateAccount(token: string, email: string, tokenId: number): Observable<ResponseMessage>;
    abstract login(credentials: loginUserPayload): Observable<UserModel | null>;
    abstract rememberPassword(email: string): Observable<ResponseMessage>;
    abstract resetPassword(password: string): Observable<ResponseMessage>;
    abstract logout(): Observable<void>;

    // helper methods
    abstract isAuthenticated(): boolean;
    abstract hasRole(role: number): boolean;
    abstract userPassedTheFirstOnboarding(): boolean;

    // token management methods
    abstract getToken(): string | null;
    abstract storeToken(token: string): void;
    abstract removeToken(): void;
    abstract addBearerToken(request: HttpRequest<any>, token: string): HttpRequest<any>

    abstract fetchSignupPageVisibility(): Observable<boolean>;
    abstract checkInvitedSignupUser(emailInQueryString: string): Observable<any>;
}
