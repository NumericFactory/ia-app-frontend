import { Component, Inject, Input, booleanAttribute } from '@angular/core';
import { UiConversationLoaderSkeletonComponent } from '../ui-loader-skeleton/ui-conversation-loader-skeleton.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AlertService } from '../../../../shared/services/alert.service';
import { MarkdownModule } from 'ngx-markdown';
import { WINDOW } from '../../../../shared/services/window';
import { LoaderService } from '../../../../shared/services/loader.service';

interface SelectionRectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}

@Component({
  selector: 'ui-conversation-ia',
  standalone: true,
  imports: [UiConversationLoaderSkeletonComponent, DatePipe, AsyncPipe, MarkdownModule],
  templateUrl: './ui-conversation-ia.component.html',
  styleUrl: './ui-conversation-ia.component.scss'
})
export class UiConversationIaComponent {

  @Input() responseAI: any; //{text: string, createdAt:string, }
  @Input({ transform: booleanAttribute }) isLoadingResponse = false;

  public hostRectangle!: SelectionRectangle | null;
  private selectedText!: string;

  loader$ = this.loaderService.isLoading$;

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit() {

  }

  onSelect(event: Event) {

    if (event.target === null) return;
    const selection = event.target

  }

  onReady() {

  }

  copyToClipBoard(responseAIText: string) {
    navigator.clipboard.writeText(responseAIText);
    this.alertService.show('Copié!', 'info', 2000, 'center');
  }

  onSelectionText(event: Event) {
    if (this.window.getSelection()) {
      let selectedText: string | undefined = this.window.getSelection()?.toString();
      if (selectedText && selectedText.length > 3) {
        this.copyToClipBoard(selectedText)
      }
    }
  }



  /************************************ */

  // ---
  // PUBLIC METHODS.
  // ---

  // I render the rectangles emitted by the [textSelect] directive.
  public renderRectangles(event: any): void {

    console.group("Text Select Event");



    console.groupEnd();

    // If a new selection has been created, the viewport and host rectangles will
    // exist. Or, if a selection is being removed, the rectangles will be null.
    if (event.hostRectangle) {

      this.hostRectangle = event.hostRectangle;
      this.selectedText = event.text;

    } else {

      this.hostRectangle = null;
      this.selectedText = "";

    }

  }


  // I share the selected text with friends :)
  public shareSelection(): void {
    console.group("Shared Text");
  }


}
