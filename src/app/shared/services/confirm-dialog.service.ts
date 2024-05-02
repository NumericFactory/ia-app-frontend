import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { UiConfirmDialogComponent } from '../../ui/public/ui-confirm-dialog/ui-confirm-dialog.component';
import { Observable, lastValueFrom, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private dialog: Dialog) { }

  async confirm(title: string, text: string): Promise<boolean> {

    const dialogRef = this.dialog.open(UiConfirmDialogComponent, {
      width: '100%',
      minWidth: '320px',
      maxWidth: '450px',
      maxHeight: '420px',
      panelClass: 'dialog-user-var',
      data: { confirmTitle: title, confirmText: text }
    });

    const res = await lastValueFrom(dialogRef.closed);
    const response = res === 'true';

    return lastValueFrom(of(response)) as Promise<boolean>;
  }


}
