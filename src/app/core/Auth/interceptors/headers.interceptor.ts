import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { APP_CONFIG } from "../../config/app-config";
import { AuthStore } from "../store/auth.store";

export const appHeadersInterceptor: HttpInterceptorFn = (req, next) => {
    const cfg = inject(APP_CONFIG);
    const store = inject(AuthStore);
    const accessToken: string | null = store.accessToken();
    const refreshToken: string | null = store.refreshToken();
    const appName: string | null = store.externalAppName();
    const appUrl: string | null = store.externalAppUrl();

    const headers: Record<string, string> = {};

    if (cfg.appNameHeader || appName) headers['X-Application-Name'] = appName ?? cfg.appNameHeader;
    if (cfg.appBaseUrl || appUrl) headers['X-Client-Url'] = appUrl ?? cfg.appBaseUrl;
    if (accessToken) headers['Authorization'] = 'Bearer ' + accessToken;
    if (refreshToken && typeof refreshToken === 'string') {
        headers['X-Refresh-Token'] = refreshToken;
    }

    return next(req.clone({ setHeaders: headers }));
}