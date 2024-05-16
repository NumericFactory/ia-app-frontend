import { Observable } from "rxjs";
import { PromptModel, StepModel } from "../models/step.model";
import { CategoryModel } from "../models/category.model";

// AuthGateway interface contract
export abstract class StepGateway {

    abstract steps$: Observable<StepModel[]>;
    abstract prompts$: Observable<PromptModel[]>;
    abstract categories$: Observable<CategoryModel[]>;


    // abstract methods
    abstract fetchCategories(): Observable<CategoryModel[]>;

    abstract getSteps(): Observable<StepModel[]>;
    abstract getStepById(id: number): Observable<StepModel | null>;

    abstract getPrompts(stepId: number): Observable<PromptModel[]>;
    abstract getPromptById(stepId: number, promptId: number): Observable<PromptModel | null>;

    abstract getPromptsByCategory(categoryId: number): Observable<PromptModel[]>;

}