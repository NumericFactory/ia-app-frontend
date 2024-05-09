import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges, ViewChild, booleanAttribute } from '@angular/core';
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

  // get htmlelement #refreshBtn
  @ViewChild('refreshBtn') refreshBtn!: ElementRef;


  // role : affiche le prompt de l'utilisateur
  @Input() prompt!: PromptModel;
  @Input({ transform: booleanAttribute }) isLoadingResponse = false;
  @Input() user!: UserModel;

  @Output() refreshPromptEvent = new EventEmitter<PromptModel>();

  constructor(private renderer: Renderer2) {

  }

  // emit event to refresh prompt (parent prompt-view.component.ts)
  refreshPromptAction(prompt: PromptModel) {
    console.log('UiConversationUserComponent', this.refreshBtn);
    this.refreshPromptEvent.emit(prompt);
    this.renderer.setAttribute(this.refreshBtn.nativeElement, 'disabled', 'true');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
    if (changes['isLoadingResponse']
      && changes['isLoadingResponse'].previousValue === true
      && changes['isLoadingResponse'].currentValue === false) {
      this.renderer.removeAttribute(this.refreshBtn.nativeElement, 'disabled');
    }
    //this.renderer.removeAttribute(this.refreshBtn.nativeElement, 'disabled');
  }


}
