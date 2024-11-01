import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 3000) {
    this.snackbar.open(message, 'Close', {
      duration,
      panelClass: ['custom-success-snackbar'],
    });
  }

  showError(message: string, duration: number = 3000) {
    this.snackbar.open(message, 'Close', {
      duration,
      panelClass: ['custom-error-snackbar'],
    });
  }
}
