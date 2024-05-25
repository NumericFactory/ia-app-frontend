import { Observable } from "rxjs";

export abstract class IAGateway {
    abstract ask(question: string): Observable<any>;
    abstract getIaProviders(): Observable<any>;
    abstract getIaModels(): Observable<any>;
    abstract updateIaProviderModel(providerId: number, modelId: number): Observable<any>;
    abstract updateIaProviderActive(providerId: number): Observable<any>;
    abstract getActiveProvider(): Observable<any>;
}