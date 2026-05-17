import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class LayoutModule { }
