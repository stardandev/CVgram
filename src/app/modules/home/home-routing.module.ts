import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';


const routes: Routes = [
  {
    path : '',
    redirectTo : '/landing',
    pathMatch : 'full'
  },
  {
    path : 'landing',
    component : LandingComponent
  },
  {
    path : '**',
    redirectTo : '/landing',
    pathMatch : 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
