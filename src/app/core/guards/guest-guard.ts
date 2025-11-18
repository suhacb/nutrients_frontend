import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthStore } from '../Auth/store/auth.store';


@Injectable({providedIn: 'root'})

export class GuestGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
//   constructor(private store: AuthStore, private router: Router, private snackbar: ApiHandlerService) {}
// 
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
//     const accessToken = localStorage.getItem('access_token');
//     if (!accessToken) {
//       // Clear all tokens
//       this.store.resetToken();
//       return true; // allow access to login
//     }
// 
//     // Access token exists in local storage → sync store
//     const token = this.store.accessToken(); // readonly signal
//     if (!token) {
//       this.store.setToken({
//         accessToken: localStorage.getItem('access_token') ?? '',
//         tokenType: localStorage.getItem('token_type') ?? '',
//         expiresIn: Number(localStorage.getItem('expires_in')) ?? 0,
//         refreshToken: localStorage.getItem('refresh_token') ?? '',
//         refreshExpiresIn: Number(localStorage.getItem('refresh_expires_in')) ?? 0,
//         scope: localStorage.getItem('scope') ?? '',
//         idToken: localStorage.getItem('id_token') ?? '',
//         notBeforePolicy: localStorage.getItem('not_before_policy') ?? '',
//         sessionState: localStorage.getItem('session_state') ?? '',
//       });
//     }
//     this.snackbar.showSuccess('You are already logged in.');
//     return this.router.parseUrl('/');
//   }
}