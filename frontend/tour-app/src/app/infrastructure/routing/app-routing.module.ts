import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from '../../layout/register/register.component';
import { LoginComponent } from 'src/app/layout/login/login.component';
import { HomeComponent } from 'src/app/layout/home/home.component';
import { TourDetailsComponent } from 'src/app/layout/tourDetails/tour-details.component';
import { TourCreateComponent } from 'src/app/layout/tour-create/tour-create.component';
import { TourEditComponent } from 'src/app/layout/tour-edit/tour-edit.component';
import { MyToursComponent } from 'src/app/layout/my-tours/my-tours.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'tour/:id', component: TourDetailsComponent },
  { path: 'my-tours', component: MyToursComponent},
  { path: 'tour/edit/:id', component: TourEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
