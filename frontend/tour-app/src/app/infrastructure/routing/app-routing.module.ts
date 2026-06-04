import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from '../../layout/register/register.component';
import { LoginComponent } from 'src/app/layout/login/login.component';
import { HomeComponent } from 'src/app/layout/home/home.component';
import { TourDetailsComponent } from 'src/app/layout/tourDetails/tour-details.component';
import { TourCreateComponent } from 'src/app/layout/tour-create/tour-create.component';
import { TourEditComponent } from 'src/app/layout/tour-edit/tour-edit.component';
import { MyToursComponent } from 'src/app/layout/my-tours/my-tours.component';
import { FollowRecommendationsComponent } from 'src/app/layout/follow-recommendations/follow-recommendations.component';
import { BlogListComponent } from 'src/app/layout/blog-list/blog-list.component';
import { BlogCreateComponent } from 'src/app/layout/blog-create/blog-create.component';
import { PositionSimulatorComponent } from 'src/app/layout/position-simulator/position-simulator.component';
import { TourExecutionComponent } from 'src/app/layout/tour-execution/tour-execution.component';
import { TourExecutionsListComponent } from 'src/app/layout/tour-executions-list/tour-executions-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'tour/:id', component: TourDetailsComponent },
  { path: 'my-tours', component: MyToursComponent},
  { path: 'tours/create', component: TourCreateComponent },
  { path: 'tour/edit/:id', component: TourEditComponent},
  { path: 'follow-recommendations', component: FollowRecommendationsComponent },
  { path: 'blogs/create', component: BlogCreateComponent },
  { path: 'blogs', component: BlogListComponent },
  { path: 'position-simulator', component: PositionSimulatorComponent },
  { path: 'my-tour-executions', component: TourExecutionsListComponent },
  { path: 'tour-execution/:id', component: TourExecutionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
