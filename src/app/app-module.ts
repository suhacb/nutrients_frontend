import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { App } from './app';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { Test } from './test/test';
import { CallbackPage } from './modules/callback/pages/callback-page/callback-page';
import { AppRoutingModule } from './app-routing-module';
import { HomePage } from './modules/home/home';
import { appHeadersInterceptor } from './core/Auth/interceptors/headers.interceptor';
import { AuthLayout } from './modules/auth-layout/auth-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Welcome } from './modules/welcome/welcome';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmCancelDialog } from './core/ConfirmCancelDialog/confirm-cancel-dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { SnackBarComponent } from './core/SnackBarComponent/snack-bar-component';

/** Material 3 components and modules */


@NgModule({
  declarations: [
    App,
    Test,
    CallbackPage,
    HomePage,
    AuthLayout,
    Welcome,
    ConfirmCancelDialog,
    SnackBarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatDialogModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([
        appHeadersInterceptor
      ])
    )
  ],
  bootstrap: [App]
})
export class AppModule { }
