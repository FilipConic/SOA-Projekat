import { Component, OnInit } from '@angular/core';
import { TourService } from 'src/app/services/tour.service';
import { Tour } from 'src/app/models/tour.model';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}


  ngOnInit() {
    this.tourService.getAllTours().subscribe(data => {
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

    this.router.navigate(['/tour', id]);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access-token');
  }

}
