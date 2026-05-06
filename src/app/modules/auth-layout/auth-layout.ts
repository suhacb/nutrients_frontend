import { Component, inject } from '@angular/core';
import { AuthStore } from '../../core/Auth/store/auth.store';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmCancelDialog } from '../../core/ConfirmCancelDialog/confirm-cancel-dialog';
import { APP_CONFIG } from '../../config/app-config';

@Component({
  selector: 'app-auth-layout',
  standalone: false,
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayout {
  public cfg = inject(APP_CONFIG);

  sidebarCollapsed = false;
  aiPanelOpen = false;

  constructor(public store: AuthStore, private router: Router, private dialog: MatDialog) {}

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleAiPanel(): void {
    this.aiPanelOpen = !this.aiPanelOpen;
  }

  openLogoutModal(): void {
    const dialogRef = this.dialog.open(ConfirmCancelDialog, {
      width: '600px',
      disableClose: true,
      data: { title: 'Logout', content: 'Do you want to logout?' }
    });

    dialogRef.componentInstance.confirm.subscribe(() => this.logout(dialogRef));
    dialogRef.componentInstance.cancel.subscribe(() => dialogRef.close());
  }

  logout(dialogRef: MatDialogRef<ConfirmCancelDialog>): void {
    this.store.logout().subscribe({
      next: () => {
        dialogRef.close();
        this.router.navigate(['/welcome']);
      },
      error: (error) => console.log(error)
    });
  }
}
