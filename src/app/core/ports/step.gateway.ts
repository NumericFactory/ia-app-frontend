import { Observable } from "rxjs";
import { PromptModel, StepModel } from "../models/step.model";

// AuthGateway interface contract
export abstract class StepGateway {

    abstract steps$: Observable<StepModel[]>;
    abstract prompts$: Observable<PromptModel[]>;


    // abstract methods
    abstract getSteps(): Observable<StepModel[]>;
    abstract getStepById(id: number): Observable<StepModel | null>;

    abstract getPrompts(stepId: number): Observable<PromptModel[]>;
    abstract getPromptById(stepId: number, promptId: number): Observable<PromptModel | null>;

}