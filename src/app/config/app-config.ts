import { InjectionToken } from "@angular/core";
import { environment } from "../environments/environments";

export interface AppConfig {
    appNameHeader: string;
    appBaseUrl: string;
    appName: string;
    appTitle: string
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
    factory: () => {
        const e = import.meta.env;
        return {
            appNameHeader: environment.APPLICATION_NAME,
            appBaseUrl: environment.CLIENT_URL,
            appName: environment.APP_NAME,
            appTitle: environment.APP_TITLE
        }
    }
});