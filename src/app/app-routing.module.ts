import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NoPageFoundComponent,
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
    PagesRoutingModule,
    AuthRoutingModule,
  ]
})
export class AppRoutingModule { }
