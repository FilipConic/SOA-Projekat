import { Component, OnInit } from '@angular/core';
import { TourService } from 'src/app/services/tour.service';
import { Tour } from 'src/app/models/tour.model';

@Component({
  selector: 'app-my-tours',
  templateUrl: './my-tours.component.html',
  styleUrls: ['./my-tours.component.css']
})
export class MyToursComponent implements OnInit {
  
  tours: Tour[] = [];
  isLoading = true;

  constructor(private tourService: TourService) {}

  ngOnInit() {
    this.tourService.getMyTours().subscribe({
      next: (data) => {
        this.tours = data;
        this.isLoading = false;
        console.log("My tours loaded:", this.tours);
      },
      error: (err) => {
        console.error("Error fetching your tours:", err);
        this.isLoading = false;
      }
    });
  }
}