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
import { NutrientShowPage } from './modules/nutrients/pages/show/show';
import { NutrientsShowResolver } from './modules/nutrients/resolvers/NutrientsShowResolver';
import { IngredientsIndexPage } from './modules/ingredients/pages/index';
import { IngredientShowPage } from './modules/ingredients/pages/show/show';
import { IngredientsShowResolver } from './modules/ingredients/resolvers/IngredientsShowResolver';
import { NutripediaPage } from './modules/nutripedia/nutripedia';

const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomePage, canActivate: [AuthGuard], pathMatch: 'full' },
      { path: 'test', component: Test, canActivate: [AuthGuard], pathMatch: 'full' },
      { path: 'nutripedia', redirectTo: 'nutripedia/nutrients', pathMatch: 'full' },
      { path: 'nutripedia/:category', component: NutripediaPage, canActivate: [AuthGuard] },
      { path: 'nutripedia/:category/:id', component: NutripediaPage, canActivate: [AuthGuard] },
      { path: 'nutrients', redirectTo: 'nutripedia/nutrients', pathMatch: 'full' },
      { path: 'nutrients/:id', redirectTo: 'nutripedia/nutrients/:id' },
      { path: 'ingredients', redirectTo: 'nutripedia/ingredients', pathMatch: 'full' },
      { path: 'ingredients/:id', redirectTo: 'nutripedia/ingredients/:id' },
      { path: '_nutrients', canActivate: [AuthGuard], children: [
          { path: '', component: NutrientsIndexPage, pathMatch: 'full' },
          { path: ':id', component: NutrientShowPage, resolve: { data: NutrientsShowResolver } }
        ]
      },
      { path: '_ingredients', canActivate: [AuthGuard], children: [
          { path: '', component: IngredientsIndexPage, pathMatch: 'full' },
          { path: ':id', component: IngredientShowPage, resolve: { data: IngredientsShowResolver } }
        ]
      },
    ]
  },
  { path: 'callback', component: CallbackPage, pathMatch: 'full', canActivate: [GuestGuard] },
  { path: 'welcome', component: Welcome, pathMatch: 'full', canActivate: [GuestGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
