import { Observable } from "rxjs";
import { PromptModel, StepModel } from "../models/step.model";
import { CategoryModel } from "../models/category.model";
import { PlanModel } from "../models/plan.model";

// PlanGateway interface contract
export abstract class PlanGateway {

    abstract plan$: Observable<PlanModel[]>;

    abstract getPlans(): Observable<PlanModel[]>

}