import { Component, OnInit } from '@angular/core';
import { TourService } from 'src/app/services/tour.service';
import { Tour } from 'src/app/models/tour.model';
import { Router } from '@angular/router';
import { TourExecutionService } from 'src/app/services/tour-execution.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  tours: Tour[] = [];
  showSnackbar = false;
  snackbarTimer: any;

  constructor (
    private tourService: TourService,
    private router: Router,
    private tourExecutionService: TourExecutionService
  ) {}


  ngOnInit() {
    this.tourService.getAllTours().subscribe(data => {
     // console.log("HOME DATA:", data);
     console.log("STATUSI:", data.map(t => ({ id: t.id, status: t.Status })));
      this.tours = data;
    });
  }

  tourDetails(id: string) {
    if( !this.isLoggedIn()){
      this.showSnackbar = true;
      clearTimeout(this.snackbarTimer);

      this.snackbarTimer =  setTimeout(() => {
        this.showSnackbar = false;
      }, 2000);
      return;
    }
    console.log("CLICKED ID:", id);
    this.router.navigate(['/tour', id]);
  }

  startTour(id: string) {
    if( !this.isLoggedIn()){
      this.showSnackbar = true;
      clearTimeout(this.snackbarTimer);

      this.snackbarTimer =  setTimeout(() => {
        this.showSnackbar = false;
      }, 2000);
      return;
    }
    
    this.tourExecutionService.startTour(id).subscribe({
      next: (execution) => {
        console.log("Tour started, execution ID:", execution.id);
        this.router.navigate(['/tour-execution', execution.id]);
      },
      error: (err) => console.error('Error starting tour:', err)
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access-token');
  }

}
