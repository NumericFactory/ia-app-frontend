import { Observable } from "rxjs";
import { PlanModel } from "../models/plan.model";

// PlanGateway interface contract
export abstract class PlanGateway {

    abstract plan$: Observable<PlanModel[]>;

    abstract getPlans(): Observable<PlanModel[]>

}