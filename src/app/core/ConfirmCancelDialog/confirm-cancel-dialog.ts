import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ConfirmCancelDialogData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-confirm-cancel-dialog',
  standalone: false,
  templateUrl: './confirm-cancel-dialog.html',
  styleUrl: './confirm-cancel-dialog.scss'
})
export class ConfirmCancelDialog {
  @Output() cancel = new EventEmitter;
  @Output() confirm = new EventEmitter;
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmCancelDialogData, private dialogRef: MatDialogRef<ConfirmCancelDialog>) {}

  onCancelClick(): void {
    this.cancel.emit();
  }

  onConfirmClick(): void {
    this.confirm.emit();
  }
}
