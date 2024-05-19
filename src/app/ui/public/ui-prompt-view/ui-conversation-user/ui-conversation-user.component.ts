import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges, ViewChild, booleanAttribute } from '@angular/core';
import { PromptModel } from '../../../../core/models/step.model';
import { ProgressBarModule } from 'primeng/progressbar';
import { DatePipe } from '@angular/common';
import { UserModel } from '../../../../core/models/user.model';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'ui-conversation-user',
  standalone: true,
  imports: [ProgressBarModule, DatePipe, TooltipModule],
  templateUrl: './ui-conversation-user.component.html',
  styleUrl: './ui-conversation-user.component.scss'
})
export class UiConversationUserComponent {

  // get htmlelement #refreshBtn
  @ViewChild('refreshBtn') refreshBtn!: ElementRef;

  // role : affiche le prompt de l'utilisateur
  @Input() prompt!: PromptModel;
  @Input({ transform: booleanAttribute }) isLoadingResponse = false;
  @Input() user!: UserModel;

  // state
  @Input({ transform: booleanAttribute }) isChecked!: boolean;
  @Input({ transform: booleanAttribute }) loadingGeneral!: boolean;

  @Output() refreshPromptEvent = new EventEmitter<PromptModel>();

  constructor(private renderer: Renderer2) {

  }

  // emit event to refresh prompt (parent prompt-view.component.ts)
  refreshPromptAction(prompt: PromptModel) {

    this.refreshPromptEvent.emit(prompt);
    //this.renderer.setAttribute(this.refreshBtn.nativeElement, 'disabled', 'true');
  }

}
