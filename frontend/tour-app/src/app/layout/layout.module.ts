import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { TourDetailsComponent } from './tourDetails/tour-details.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    MapComponent,
    HomeComponent,
    NavbarComponent,
    TourDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
  ]
})
export class LayoutModule { }
