import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private snackbar: MatSnackBar) { }

  show(message: string, type?: 'error' | 'success' | 'info', duration?: number, position?: 'center' | 'right') {
    //if (!message) return;
    let cssclass = '';
    switch (type) {
      case 'error': cssclass = 'error-snackbar'; break;
      case 'success': cssclass = 'success-snackbar'; break;
      default: cssclass = 'info-snackbar'; // default value
    }
    this.snackbar.open(message, 'Fermer', {
      duration: duration ? duration : 6000,
      verticalPosition: 'top',
      horizontalPosition: position ? position : 'right',
      panelClass: ['showbar', cssclass]
    })
  }
}
