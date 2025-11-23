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
import { SpinnerInterceptor } from './core/Spinner/spinner.interceptor';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Spinner } from './core/Spinner/spinner';
import { MainMenu } from './modules/auth-layout/main-menu/main-menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { NutrientsIndexPage } from './modules/nutrients/pages/index/index';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NutrientShowPage } from './modules/nutrients/pages/show/show';

/** Material 3 components and modules */


@NgModule({
  declarations: [
    AuthLayout,
    App,
    Test,
    CallbackPage,
    HomePage,
    Spinner,
    Welcome,
    ConfirmCancelDialog,
    SnackBarComponent,
    MainMenu,
    NutrientsIndexPage,
    NutrientShowPage,
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatListModule,
    MatDividerModule,
    MatPaginatorModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([
        appHeadersInterceptor,
        SpinnerInterceptor
      ])
    )
  ],
  bootstrap: [App]
})
export class AppModule { }
