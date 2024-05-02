import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthGateway } from '../../../../core/ports/auth.gateway';
import { StepGateway } from '../../../../core/ports/step.gateway';
import { Observable } from 'rxjs';
import { PromptModel, StepModel } from '../../../../core/models/step.model';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-prompt-view',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, JsonPipe],
  templateUrl: './prompt-view.component.html',
  styleUrl: './prompt-view.component.scss'
})
export class PromptViewComponent {

  stepId!: number;
  promptId!: number;
  step$!: Observable<StepModel | null>;
  prompt$!: Observable<PromptModel | null>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stepService: StepGateway,
    private auth: AuthGateway
  ) { }

  ngOnInit(): void {
    this.stepId = this.route.snapshot.params['stepid'];
    this.promptId = this.route.snapshot.params['promptid'];

    this.prompt$ = this.stepService.getPromptById(this.stepId, this.promptId);

    this.step$ = this.stepService.getStepById(this.stepId);
    // this.stepService.getStepById(this.stepId).subscribe((step) => {
    //   console.log(step);
    // });

    this.route.params.subscribe((params) => {
      this.stepId = params['stepid'];
      this.promptId = params['promptid'];
      this.prompt$ = this.stepService.getPromptById(this.stepId, this.promptId);
    });
  }

  goBack() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

}
