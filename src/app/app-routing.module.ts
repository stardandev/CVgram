import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './modules/shared/components/registration/registration.component';
import { ResetPasswordComponent } from './modules/shared/components/reset-password/reset-password.component';


const routes: Routes = [
  {
    path : '',
    redirectTo: 'home',
    pathMatch : 'full'
  },
  {
    path : 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path : 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path : 'register/:key',
    component: RegistrationComponent
  },
  {
    path : 'reset-password/:userId/:key',
    component : ResetPasswordComponent
  },
  {
    path : '**',
    redirectTo : 'home',
    pathMatch : 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
