import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export type SnackbarType = 'success' | 'error';

export interface SnackbarData {
  message: string;
  type?: SnackbarType; // default: 'success'
}

@Component({
  selector: 'app-snack-bar-component',
  standalone: false,
  templateUrl: './snack-bar-component.html',
  styleUrl: './snack-bar-component.scss'
})
export class SnackBarComponent {
  type: SnackbarType;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    private snackBarRef: MatSnackBarRef<SnackBarComponent>
  ) {
    this.type = data.type || 'success';
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }

  get icon(): string {
    return this.type === 'success' ? 'check_circle' : 'error';
  }

  get cssClass(): string {
    return this.type === 'success' ? 'snackbar-success' : 'snackbar-error';
  }
}
