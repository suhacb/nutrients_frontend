import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Test } from './test/test';
import { CallbackPage } from './modules/callback/pages/callback-page/callback-page';
import { HomePage } from './modules/home/home';
import { AuthGuard } from './core/guards/auth-guard';
import { App } from './app';
import { AuthLayout } from './modules/auth-layout/auth-layout';
import { GuestLayout } from './modules/guest-layout/guest-layout';
import { GuestGuard } from './core/guards/guest-guard';
import { Welcome } from './modules/welcome/welcome';

const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomePage,
        canActivate: [AuthGuard],
        pathMatch: 'full',
      },
      {
        path: 'test',
        component: Test,
        canActivate: [AuthGuard],
        pathMatch: 'full',
      },
    ]
  },
  {
    path: '',
    component: GuestLayout,
    canActivate: [GuestGuard],
    children: [
      {
        path: 'callback',
        component: CallbackPage,
        pathMatch: 'full',
      },
      {
        path: 'welcome',
        component: Welcome,
        pathMatch: 'full',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
