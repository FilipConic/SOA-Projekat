import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from '../../layout/register/register.component';
import { LoginComponent } from 'src/app/layout/login/login.component';
import { HomeComponent } from 'src/app/layout/home/home.component';
import { TourDetailsComponent } from 'src/app/layout/tourDetails/tour-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'tour/:id', component: TourDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
