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

  constructor (
    private tourService: TourService,
    private router: Router
  ) {}


  ngOnInit() {
    this.tourService.getAllTours().subscribe(data => {
      console.log(this.tours);
      console.log("DATA FROM BE:", data);
      this.tours = data;
    });
  }

  tourDetails(id: string) {
    this.router.navigate(['/tour', id]);
  }

}
