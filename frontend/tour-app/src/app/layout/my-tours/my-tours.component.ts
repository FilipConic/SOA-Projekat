import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TourService } from 'src/app/services/tour.service';
import { Tour, UpdateTourDTO } from 'src/app/models/tour.model';
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
    this.loadTours();
  }
  onCreateClick() {
    this.router.navigate(['/tours/create']);
  }

  loadTours(){
    this.isLoading = true;
    this.tourService.getMyTours().subscribe({
      next: (data) => {
        this.tours = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching tours:', err);
        this.isLoading = false;
      }
    });
  }

  changeStatus(tour: Tour, newStatus: 'published' | 'archived' | 'draft')
  {
    const payload: UpdateTourDTO = {
      Title: tour.Title,
      Description: tour.Description,
      Difficulty: tour.Difficulty as unknown as string, // enum ---> string konverzija za API
      Tags: tour.Tags,
      Price: tour.Price,
      DurationWalk: tour.DurationWalk,
      DurationBike: tour.DurationBike,
      DurationCar: tour.DurationCar,
      Status: newStatus
    };
    this.tourService.updateTour(tour.id, payload).subscribe({
      next: () => {
        tour.status = newStatus;
      },
      error: (err) => console.error('Failed to update status:', err)
    });

  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'published': return 'Published';
      case 'archived': return 'Archived';
      default: return 'Draft';
    }
  }
}
