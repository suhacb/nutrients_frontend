import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Test } from './test/test';
import { CallbackPage } from './modules/callback/pages/callback-page/callback-page';
import { HomePage } from './modules/home/home';
import { AuthGuard } from './core/guards/auth-guard';
import { App } from './app';

const routes: Routes = [
  {
    path: 'test',
    component: Test,
    canActivate: [AuthGuard]
  },
  {
    path: 'callback',
    component: CallbackPage
  },
  {
    path: 'home',
    component: HomePage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
