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

  changeStatus(tour: Tour, newStatus: 'published' | 'archived' | 'draft') {
      if (newStatus === 'archived') {
          this.tourService.archiveTour(tour.id).subscribe({
              next: () => {
                  tour.status = 'archived';
                  tour.ArchivedAt = new Date().toISOString();
              },
              error: (err) => {
                  console.error('Status:', err.status);
                  console.error('Message:', err.error);
              }
          });
      } else if (newStatus === 'published' && tour.status === 'draft') {
          this.tourService.publishTour(tour.id).subscribe({
              next: () => {
                  tour.status = 'published';
                  tour.PublishedAt = new Date().toISOString();
              },
              error: (err) => {
                  console.error('Status:', err.status);
                  console.error('Message:', err.error);
              }
          });
      } else if (newStatus === 'published' && tour.status === 'archived') {
          this.tourService.publishFromArchiveTour(tour.id).subscribe({
              next: () => {
                  tour.status = 'published';
                  tour.PublishedAt = new Date().toISOString();
              },
              error: (err) => {
                  console.error('Status:', err.status);
                  console.error('Message:', err.error);
              }
          });
      }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'published': return 'Published';
      case 'archived': return 'Archived';
      default: return 'Draft';
    }
  }

  getStatusDate(tour: Tour): string {
    if (tour.status === 'published' && tour.PublishedAt) {
      return 'Published: ' + new Date(tour.PublishedAt).toLocaleDateString();
    }
    if (tour.status === 'archived' && tour.ArchivedAt) {
      return 'Archived: ' + new Date(tour.ArchivedAt).toLocaleDateString();
    }
    return '';
  }
}
