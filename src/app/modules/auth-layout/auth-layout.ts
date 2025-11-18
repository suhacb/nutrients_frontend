import { Component } from '@angular/core';
import { AuthStore } from '../../core/Auth/store/auth.store';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmCancelDialog } from '../../core/ConfirmCancelDialog/confirm-cancel-dialog';

@Component({
  selector: 'app-auth-layout',
  standalone: false,
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayout {
  constructor(public store: AuthStore, private router: Router, private dialog: MatDialog) {}

  openLogoutModal(): void {
    const dialogRef = this.dialog.open(ConfirmCancelDialog, {
      width: '600px',
      disableClose: true,
      data: {
        title: 'Logout',
        content: 'Do you want to logout?'
      }
    });

    const modalInstance = dialogRef.componentInstance;
    modalInstance.confirm.subscribe(() => {
      this.logout(dialogRef);
    });

    modalInstance.cancel.subscribe(() => {
      dialogRef.close();
    });
  }

  logout(dialogRef: MatDialogRef<ConfirmCancelDialog>) {
    this.store.logout().subscribe({
      next: () => {
        dialogRef.close();
        this.router.navigate(['/welcome']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  };

}
