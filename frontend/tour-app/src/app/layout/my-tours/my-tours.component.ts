import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TourService } from 'src/app/services/tour.service';
import { Tour, UpdateTourDTO } from 'src/app/models/tour.model';

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
    private router: Router
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
      Duration: tour.Duration,
      Status: newStatus
    };
    this.tourService.updateTour(tour.id, payload).subscribe({
      next: () => {
        tour.Status = newStatus;
      },
      error: (err) => console.error('Failed to update status:', err)
    });

  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'published': return 'Objavljena';
      case 'archived': return 'Arhivirana';
      default: return 'Draft';
    }
  }
}
