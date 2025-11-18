import { Component } from '@angular/core';
import { AuthStore } from '../../core/Auth/store/auth.store';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-auth-layout',
  standalone: false,
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayout {
  constructor(public store: AuthStore, private router: Router, private dialog: MatDialog) {}
}
