import { Observable } from "rxjs";

export abstract class IAGateway {
    abstract ask(question: string): Observable<any>;
    abstract getIaProviders(): Observable<any>;
    abstract getIaModels(): Observable<any>;
}