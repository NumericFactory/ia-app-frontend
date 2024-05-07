import { Observable } from "rxjs";

export abstract class IAGateway {
    abstract ask(question: string): Observable<any>;
}