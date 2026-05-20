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
import { ReviewTourComponent } from './tour-review/tour-review.component';
import { TourCreateComponent } from './tour-create/tour-create.component';
import { KeypointModalComponent } from './keypoint-modal/keypoint-modal.component';
import { TourEditComponent } from './tour-edit/tour-edit.component';
import { MyToursComponent } from './my-tours/my-tours.component';
import { FollowRecommendationsComponent } from './follow-recommendations/follow-recommendations.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    MapComponent,
    HomeComponent,
    NavbarComponent,
    TourDetailsComponent,
    ReviewTourComponent,
    TourCreateComponent,
    KeypointModalComponent,
    TourEditComponent,
    MyToursComponent,
    FollowRecommendationsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    MapComponent
  ]
})
export class LayoutModule { }
