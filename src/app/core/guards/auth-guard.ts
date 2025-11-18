import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthStore } from '../Auth/store/auth.store';
import { AccessTokenMapper } from '../AccessToken/AccessTokenMapper';
import { AccessToken } from '../AccessToken/AccessToken';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: AuthStore, private router: Router) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> {
    /**
     * Populate AuthStore from localStorage if token exists but store is empty.
     * Ensures store is restored after a hard page reload.
     */
    const tokenDefinition = new AccessTokenMapper().definition();
    tokenDefinition.forEach(key => {
      this.store.setStoreValue(key, localStorage.getItem(key) ?? null);
    });

    // If either is missing → redirect to welcome (guest page)
    if (!localStorage.getItem('accessToken') || !this.store.accessToken()) {
      this.store.resetToken();
      return this.router.parseUrl('/welcome');
    }    

    // If tokens don't match → redirect to welcome (guest page)
    if (localStorage.getItem('accessToken') !== this.store.accessToken()) {
      this.store.resetToken();
      return this.router.parseUrl('/welcome');
    }

    return this.store.validateAccessToken().pipe(
      map(isValid => {
        console.log('just validated access token');
        console.log(isValid);
        if (isValid === true) {
          console.log('should return true');
          return true;
        } else {
          return this.router.parseUrl('/');
        }
      }),
      catchError(error => {
        console.error(error);
        return of(this.router.parseUrl('/welcome'));
      })
    );
  }
}