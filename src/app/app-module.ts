import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { App } from './app';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { Test } from './test/test';
import { CallbackPage } from './modules/callback/pages/callback-page/callback-page';
import { AppRoutingModule } from './app-routing-module';
import { HomePage } from './modules/home/home';
import { appHeadersInterceptor } from './core/Auth/interceptors/headers.interceptor';
import { AuthLayout } from './modules/auth-layout/auth-layout';
import { Welcome } from './modules/welcome/welcome';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmCancelDialog } from './core/ConfirmCancelDialog/confirm-cancel-dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { SnackBarComponent } from './core/SnackBarComponent/snack-bar-component';
import { SpinnerInterceptor } from './core/Spinner/spinner.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Spinner } from './core/Spinner/spinner';
import { MainMenu } from './modules/auth-layout/main-menu/main-menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchBarComponent } from './modules/search/components/search-bar-component/search-bar-component';
import { SearchContainerItemComponent } from './modules/search/components/search-container-item-component/search-container-item-component';
import { SearchResultsItemComponent } from './modules/search/components/search-results-item-component/search-results-item-component';
import { SearchPaginationComponent } from './modules/search/components/search-pagination-component/search-pagination-component';
import { NutripediaPage } from './modules/nutripedia/nutripedia';
import { BreadcrumbComponent } from './core/Breadcrumb/breadcrumb';
import { DietTagsListPage } from './modules/recipes/pages/diet-tags-list/diet-tags-list';
import { DietTagFormDialog } from './modules/recipes/pages/diet-tags-list/diet-tag-form-dialog/diet-tag-form-dialog';
import { RecipesListPage } from './modules/recipes/pages/recipes-list/recipes-list';
import { DecimalPipe } from './core/pipes/DecimalPipe';
import { MarkdownPipe } from './core/pipes/MarkdownPipe';

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
    SearchBarComponent,
    SearchContainerItemComponent,
    SearchResultsItemComponent,
    SearchPaginationComponent,
    NutripediaPage,
    BreadcrumbComponent,
    DietTagsListPage,
    DietTagFormDialog,
    RecipesListPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatListModule,
    MatDividerModule,
    MatCardModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    DecimalPipe,
    MarkdownPipe
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
  exports: [
    DecimalPipe,
    MarkdownPipe
  ],
  bootstrap: [App]
})
export class AppModule { }
