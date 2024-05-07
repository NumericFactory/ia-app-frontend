import { Component, Input, booleanAttribute } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'ui-conversation-loader-skeleton',
  standalone: true,
  imports: [SkeletonModule],
  template: `
   <!-- loading skeleton-->
   <!-- @if(isLoadingResponse) { -->
     <div class="isLoading-skeleton">
        <p-skeleton styleClass="mb-2"></p-skeleton>
        <p-skeleton width="8rem" styleClass="mb-2"></p-skeleton>
        <p-skeleton width="6rem" styleClass="mb-2"></p-skeleton>
        <p-skeleton height="1rem" styleClass="mb-2"></p-skeleton>
        <p-skeleton width="7rem" styleClass="mb-2"></p-skeleton>
        <p-skeleton width="9rem" styleClass="mb-2"></p-skeleton>
        <p-skeleton width="9rem" styleClass="mb-2"></p-skeleton>
        <p-skeleton width="0rem" styleClass="mb-2"></p-skeleton>
        <p-skeleton width="8rem" styleClass="mb-2"></p-skeleton>
        <p-skeleton width="7rem" styleClass="mb-2"></p-skeleton>
        <p-skeleton width="5rem" styleClass="mb-2"></p-skeleton>
    </div>
   <!-- } -->
  `,

})
export class UiConversationLoaderSkeletonComponent {
}
