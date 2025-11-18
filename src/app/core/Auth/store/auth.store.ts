import { Injectable, signal, computed, inject } from '@angular/core';
import { AccessToken, AccessTokenApiResource } from '../../AccessToken/AccessToken';
import { AccessTokenMapper } from '../../AccessToken/AccessTokenMapper';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class AuthStore {
    constructor(private http: HttpClient) {}

    private _accessToken = signal<string | null>(null);
    private _tokenType = signal<string | null>(null);
    private _expiresIn = signal<number | null>(null);
    private _refreshToken = signal<string | null>(null);
    private _refreshExpiresIn = signal<number | null>(null);
    private _scope = signal<string | null>(null);
    private _idToken = signal<string | null>(null);
    private _notBeforePolicy = signal<string | null>(null);
    private _sessionState = signal<string | null>(null);
    private _externalAppName = signal<string | null>(null);
    private _externalAppUrl = signal<string | null>(null);

    // expose readonly signals
    readonly accessToken = this._accessToken.asReadonly();
    readonly tokenType = this._tokenType.asReadonly();
    readonly expiresIn = this._expiresIn.asReadonly();
    readonly refreshToken = this._refreshToken.asReadonly();
    readonly refreshExpiresIn = this._refreshExpiresIn.asReadonly();
    readonly scope = this._scope.asReadonly();
    readonly idToken = this._idToken.asReadonly();
    readonly notBeforePolicy = this._notBeforePolicy.asReadonly();
    readonly sessionState = this._sessionState.asReadonly();
    readonly externalAppName = this._externalAppName.asReadonly();
    readonly externalAppUrl = this._externalAppUrl.asReadonly();

    // derived/computed signals
    readonly isLoggedIn = computed(() => !!this._accessToken());

    // user information from access_token
    // readonly user = computed(() => {
    //     const token = this._accessToken();
    //     if (!token) return null;
    //     try {
    //         const payload: any = decodeJwt(token);
    //         return {
    //             username: payload.preferred_username,
    //             name: payload.given_name,
    //             familyName: payload.family_name,
    //             email: payload.email
    //         }
    //     } catch {
    //         return null;
    //     }
    // });

    // setters
    setToken(tokenApi: AccessTokenApiResource | null = null): void {
        if (tokenApi) {
            const token: AccessToken = new AccessTokenMapper().toApp(tokenApi);
            Object.entries(token as AccessToken).forEach(([key, value]) => {
                if (value !== undefined || value !== null) {
                    localStorage.setItem(key, value);
                    (this as any)[`_${key}`].set(value);
                } else {
                    localStorage.setItem(key, '');
                    (this as any)[`_${key}`].set(value);
                }
            });
        } else {
            const tokenKeys: string[] = new AccessTokenMapper().definition();
            tokenKeys.forEach(key => {
                (this as any)[`_${key}`].set(null);
                localStorage.removeItem(key);
            })
        }
    }

    setStoreValue(key: string, value: string | number | null) {
        (this as any)[`_${key}`].set(value);
    }

    setExternalAppName(externalAppName: string | null): void {
        this._externalAppName.set(externalAppName);
    }

    setExternalAppUrl(externalAppUrl: string | null): void {
        this._externalAppUrl.set(externalAppUrl);
    }

    resetToken() {
        this.setToken();
    }

    validateAccessToken(): Observable<boolean> {
        const url = 'http://localhost:9015/api/auth/validate-access-token';
        return this.http.get<AccessTokenApiResource | boolean | string>(url, { observe: 'response' as const}).pipe(
            map((response) => {
                if (!response.body) throw new Error('Response body is empty');
                const body = response.body;

                // If body is string, convert to boolean
                if (typeof body === 'string') {
                    return body.toLowerCase() === 'true';
                }

                // If body is an access token object
                if (typeof body === 'object' && body !== null && 'access_token' in body) {
                    this.setToken(body);
                    return true;
                }

                // Default fallback
                return false;
            }),
            catchError((error) => {
                this.resetToken();
                return of(false);
            })
        );
    }

    logout(): Observable<boolean> {
        const url = 'http://localhost:9015/api/auth/logout';
        return this.http.post<boolean>(url, [], { observe: 'response' as const}).pipe(
            map(() => {
                this.resetToken();
                // this.apiHandlerService.showSuccess('You are logged out.');
                return true;
            })
        );
    }
// 
//     private setLocalStorage(key: string, value: string | number | null): void {
//         if (value !== null && value !== undefined) {
//             const stringValue = typeof value === 'number' ? value.toString() : value;
//             localStorage.setItem(key, stringValue);
//         } else {
//             localStorage.removeItem(key);
//         }
//     }
}
