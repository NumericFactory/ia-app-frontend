import { Component, Input, booleanAttribute } from '@angular/core';
import { UiConversationLoaderSkeletonComponent } from '../ui-loader-skeleton/ui-conversation-loader-skeleton.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ui-conversation-ia',
  standalone: true,
  imports: [UiConversationLoaderSkeletonComponent, DatePipe],
  templateUrl: './ui-conversation-ia.component.html',
  styleUrl: './ui-conversation-ia.component.scss'
})
export class UiConversationIaComponent {

  @Input() responseAI: any; //{text: string, createdAt:string, }
  @Input({ transform: booleanAttribute }) isLoadingResponse = false;

  copyToClipBoard(responseAIText: string) {
    navigator.clipboard.writeText(responseAIText);

  }

}
