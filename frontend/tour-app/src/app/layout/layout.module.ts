import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogCardComponent } from './blog-card/blog-card.component';
import { BlogCreateComponent } from './blog-create/blog-create.component';
import { PositionSimulatorComponent } from './position-simulator/position-simulator.component';
import { MatIconModule } from '@angular/material/icon';
import { TourExecutionComponent } from './tour-execution/tour-execution.component';
import { TourExecutionsListComponent } from './tour-executions-list/tour-executions-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { OrderItemCardComponent } from './order-item-card/order-item-card.component';
import { PublishedToursComponent } from './published-tours/published-tours.component';


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
    FollowRecommendationsComponent,
    BlogListComponent,
    BlogCardComponent,
    BlogCreateComponent,
    PositionSimulatorComponent,
    TourExecutionComponent,
    TourExecutionsListComponent,
    ShoppingCartComponent,
    OrderItemCardComponent,
    PublishedToursComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatCardModule
  ],
  exports: [
    NavbarComponent,
    MapComponent
  ]
})
export class LayoutModule { }
