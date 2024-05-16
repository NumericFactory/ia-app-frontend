import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptModel } from '../../../../core/models/step.model';

@Component({
  selector: 'app-prompt-unique-bycategory-view',
  standalone: true,
  imports: [],
  templateUrl: './prompt-unique-bycategory-view.component.html',
  styleUrl: './prompt-unique-bycategory-view.component.scss'
})
export class PromptUniqueBycategoryViewComponent {

  prompt!: PromptModel

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log(this.route.snapshot.params['promptid'])
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

}
