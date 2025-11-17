import { Injectable, signal, computed, inject } from '@angular/core';
import { AccessToken, AccessTokenApiResource } from '../../AccessToken/AccessToken';
import { AccessTokenMapper } from '../../AccessToken/AccessTokenMapper';

@Injectable({ providedIn: 'root' })

export class AuthStore {
    constructor() {}

    private _accessToken = signal<string | null>(null);
    private _tokenType = signal<string | null>(null);
    private _expiresIn = signal<number | null>(null);
    private _refreshToken = signal<string | null>(null);
    private _refreshExpiresIn = signal<number | null>(null);
    private _scope = signal<string | null>(null);
    private _idToken = signal<string | null>(null);
    private _notBeforePolicy = signal<string | null>(null);
    private _sessionState = signal<string | null>(null);

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
                console.log(key + ': ' + value);
                if (value !== undefined || value !== null) {
                    localStorage.setItem(key, value);
                    (this as any)[`_${key}`].set(value);
                } else {
                    localStorage.setItem(key, '');
                    (this as any)[`_${key}`].set(value);
                }
            });
        } else {
            this._accessToken = signal<string | null>(null);
            this._tokenType = signal<string | null>(null);
            this._expiresIn = signal<number | null>(null);
            this._refreshToken = signal<string | null>(null);
            this._refreshExpiresIn = signal<number | null>(null);
            this._scope = signal<string | null>(null);
            this._idToken = signal<string | null>(null);
            this._notBeforePolicy = signal<string | null>(null);
            localStorage.removeItem('sessionStat');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('tokenType');
            localStorage.removeItem('expiresIn');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('refreshExpiresIn');
            localStorage.removeItem('scope');
            localStorage.removeItem('idToken');
            localStorage.removeItem('notBeforePolicy');
            localStorage.removeItem('sessionState');
        }
    }

//     setAccessToken(token: string | null = null): void {
//         this.setLocalStorage('access_token', token);
//         this._accessToken.set(token);
//     }
// 
//     setTokenType(tokenType: string | null): void {
//         this.setLocalStorage('token_type', tokenType);
//         this._tokenType.set(tokenType)
//     }
// 
//     setExpiresIn(expiresIn: number | null): void {
//         this.setLocalStorage('expires_in', expiresIn);
//         this._expiresIn.set(expiresIn)
//     }
// 
//     setRefreshToken(refreshToken: string | null): void {
//         this.setLocalStorage('refresh_token', refreshToken);
//         this._refreshToken.set(refreshToken);
//     }
// 
//     setRefreshExpiresIn(refreshExpiresIn: number | null): void {
//         this.setLocalStorage('refresh_expires_in', refreshExpiresIn);
//         this._refreshExpiresIn.set(refreshExpiresIn);
//     }
// 
//     setScope(scope: string | null): void {
//         this.setLocalStorage('scope', scope);
//         this._scope.set(scope);
//     }
// 
//     setIdToken(idToken: string | null): void {
//         this.setLocalStorage('id_token', idToken);
//         this._idToken.set(idToken);
//     }
// 
//     setNotBeforePolicy(notBeforePolicy: string | null): void {
//         this.setLocalStorage('not_before_policy', notBeforePolicy);
//         this._notBeforePolicy.set(notBeforePolicy);
//     }
// 
//     setSessionState(sessionState: string | null): void {
//         this.setLocalStorage('session_state', sessionState);
//         this._sessionState.set(sessionState);
//     }
// 
//     setExternalAppName(externalAppName: string | null): void {
//         this._externalAppName.set(externalAppName);
//     }
// 
//     setExternalAppUrl(externalAppUrl: string | null): void {
//         this._externalAppUrl.set(externalAppUrl);
//     }

    resetToken() {
        this.setToken();
    }

//     login (username: string, password: string): Observable<AccessToken> {
//         const url = 'http://localhost:9025/api/auth/login';
//         const body = {username, password};
//         return this.http.post<AccessTokenApiResource>(url, body, { observe: 'response' as const}).pipe(
//             tap(response => {
//                 this.apiHandlerService.showSuccess('Login successful.');
//             }),
//             map((response) => {
//                 if (!response.body) throw new Error('Response body is empty');
//                 const accessToken = new AccessTokenMapper().toApp(response.body);
//                 // If externalAppUrl is set, redirect back to external app callback passing a form containing the access token object. Otherwise, login into the Auth
//                 if (this.externalAppName() && this.externalAppUrl()) {
//                     return accessToken;
//                 }
//                 this.setToken(accessToken);
//                 return accessToken;
//             }),
//             catchError((error: HttpErrorResponse) => {
//                 this.apiHandlerService.showError(error);
//                 if (error.status === 401 || error.status === 422) return throwError(() => error);
//                 return EMPTY;
//             })
//         );
//     }
// 
//     validateAccessToken(): Observable<boolean> {
//         const url = 'http://localhost:9025/api/auth/validate-access-token';
//         return this.http.get<AccessTokenApiResource | boolean>(url, { observe: 'response' as const}).pipe(
//             map((response) => {
//                 if (!response.body) throw new Error('Response body is empty');
//                 if (response.body === true) return true;
//                 if ('access_token' in response.body) {
//                     const accessToken = new AccessTokenMapper().toApp(response.body);
//                     this.setToken(accessToken);
//                     return true;
//                 }
//                 return false;
//             }),
//             catchError((error) => {
//                 this.resetToken();
//                 return of(false);
//             })
//         );
//     }
// 
//     logout(): Observable<boolean> {
//         const url = 'http://localhost:9025/api/auth/logout';
//         return this.http.post<boolean>(url, [], { observe: 'response' as const}).pipe(
//             map(() => {
//                 this.resetToken();
//                 this.apiHandlerService.showSuccess('You are logged out.');
//                 return true;
//             })
//         );
//     }
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
