import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthStore } from '../Auth/store/auth.store';
import { AccessTokenMapper } from '../AccessToken/AccessTokenMapper';
import { AccessToken } from '../AccessToken/AccessToken';


@Injectable({providedIn: 'root'})

export class GuestGuard implements CanActivate {
  constructor(private store: AuthStore, private router: Router) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      // Clear all tokens
      this.store.resetToken();
      return true; // allow access to welcome or other guest page
    }

    // Access token exists in local storage → sync store and redirect to guarded homepage
    const token = this.store.accessToken();
    if (!token) {
      const tokenDefinition = new AccessTokenMapper().definition();
      this.store.setToken({
        access_token: localStorage.getItem('accessToken') ?? '',
        token_type: localStorage.getItem('tokenType') ?? '',
        expires_in: Number(localStorage.getItem('expiresIn')) ?? 0,
        refresh_token: localStorage.getItem('refreshToken') ?? '',
        refresh_expires_in: Number(localStorage.getItem('refreshExpiresIn')) ?? 0,
        scope: localStorage.getItem('scope') ?? '',
        id_token: localStorage.getItem('idToken') ?? '',
        not_before_policy: localStorage.getItem('notBeforePolicy') ?? '',
        session_state: localStorage.getItem('sessionState') ?? '',
      });
    }
    // this.snackbar.showSuccess('You are already logged in.');
    return this.router.parseUrl('/');
  }
}