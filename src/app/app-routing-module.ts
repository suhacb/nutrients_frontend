import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Test } from './test/test';
import { CallbackPage } from './modules/callback/pages/callback-page/callback-page';
import { HomePage } from './modules/home/home';
import { AuthGuard } from './core/guards/auth-guard';
import { AuthLayout } from './modules/auth-layout/auth-layout';
import { GuestGuard } from './core/guards/guest-guard';
import { Welcome } from './modules/welcome/welcome';
import { NutrientsIndexPage } from './modules/nutrients/pages/index';

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
      {
        path: 'nutrients',
        component: NutrientsIndexPage,
        canActivate: [AuthGuard],
        pathMatch: 'full',
      },
    ]
  },
  {
    path: 'callback',
    component: CallbackPage,
    pathMatch: 'full',
    canActivate: [GuestGuard],
  },
  {
    path: 'welcome',
    component: Welcome,
    pathMatch: 'full',
    canActivate: [GuestGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
