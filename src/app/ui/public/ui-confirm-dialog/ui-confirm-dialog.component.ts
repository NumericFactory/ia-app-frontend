import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, Input } from '@angular/core';

@Component({
  selector: 'app-ui-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './ui-confirm-dialog.component.html',
  styleUrl: './ui-confirm-dialog.component.scss'
})
export class UiConfirmDialogComponent {

  @Input() confirmTitle: string = '';
  @Input() confirmText: string | null = null;

  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
  ) { }

  cancelAction(): void {
    this.dialogRef.close('false');
  }

  validAction(): void {
    this.dialogRef.close('true');
  }

}
