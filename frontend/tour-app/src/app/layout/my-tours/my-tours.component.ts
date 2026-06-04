import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TourService } from 'src/app/services/tour.service';
import { Tour } from 'src/app/models/tour.model';
import { TourExecutionService } from 'src/app/services/tour-execution.service';

@Component({
  selector: 'app-my-tours',
  templateUrl: './my-tours.component.html',
  styleUrls: ['./my-tours.component.css']
})
export class MyToursComponent implements OnInit {

  tours: Tour[] = [];
  isLoading = true;

  constructor(
    private tourService: TourService,
    private router: Router,
    private tourExecutionService: TourExecutionService
  ) {}

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
  onCreateClick() {
    this.router.navigate(['/tours/create']);
  }
}
