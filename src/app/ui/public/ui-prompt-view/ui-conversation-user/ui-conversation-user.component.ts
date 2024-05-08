import { Component, EventEmitter, Input, Output, booleanAttribute } from '@angular/core';
import { PromptModel } from '../../../../core/models/step.model';
import { ProgressBarModule } from 'primeng/progressbar';
import { DatePipe } from '@angular/common';
import { UserModel } from '../../../../core/models/user.model';

@Component({
  selector: 'ui-conversation-user',
  standalone: true,
  imports: [ProgressBarModule, DatePipe],
  templateUrl: './ui-conversation-user.component.html',
  styleUrl: './ui-conversation-user.component.scss'
})
export class UiConversationUserComponent {

  // role : affiche le prompt de l'utilisateur
  @Input() prompt!: PromptModel;
  @Input({ transform: booleanAttribute }) isLoadingResponse = false;
  @Input() user!: UserModel;

  @Output() refreshPromptEvent = new EventEmitter<PromptModel>();

  // emit event to refresh prompt (parent prompt-view.component.ts)
  refreshPromptAction(prompt: PromptModel) {
    this.refreshPromptEvent.emit(prompt);
  }


}
