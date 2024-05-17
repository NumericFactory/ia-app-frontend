import { Component, Input, booleanAttribute } from '@angular/core';
import { UiConversationLoaderSkeletonComponent } from '../ui-loader-skeleton/ui-conversation-loader-skeleton.component';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../../../shared/services/alert.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'ui-conversation-ia',
  standalone: true,
  imports: [UiConversationLoaderSkeletonComponent, DatePipe, MarkdownModule],
  templateUrl: './ui-conversation-ia.component.html',
  styleUrl: './ui-conversation-ia.component.scss'
})
export class UiConversationIaComponent {

  @Input() responseAI: any; //{text: string, createdAt:string, }
  @Input({ transform: booleanAttribute }) isLoadingResponse = false;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    console.log('UiConversationIaComponent', this.responseAI);
  }

  onReady() {
    console.log('onReady');
  }

  copyToClipBoard(responseAIText: string) {
    navigator.clipboard.writeText(responseAIText);
    this.alertService.show('Copié!', 'info', 2000, 'center');
  }

  onSelectionText(event: Event) {
    console.log('onSelectionText', event);
  }

}
