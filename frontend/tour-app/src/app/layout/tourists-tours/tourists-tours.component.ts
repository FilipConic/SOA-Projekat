import { Component, OnInit } from '@angular/core';
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour.service';
import { Router } from '@angular/router';
import { TourExecutionService } from 'src/app/services/tour-execution.service';

@Component({
  selector: 'app-tourists-tours',
  templateUrl: './tourists-tours.component.html',
  styleUrls: ['./tourists-tours.component.css']
})
export class TouristsToursComponent implements OnInit {
  purchasedTours: Tour[] = [];

  constructor(private tourService: TourService,
              private tourExecutionService: TourExecutionService,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPurchasedTours();
  }

  loadPurchasedTours(): void {
    this.tourService.getPurchasedTours().subscribe({
      next: (data) => {
        this.purchasedTours = data;
        console.log(this.purchasedTours);
      },
      error: (err) => {
        console.error('Greška prilikom učitavanja kupljenih tura:', err);
      }
    });
  }

  startTour(tourId: string): void {
    this.tourExecutionService.startTour(tourId).subscribe({
      next: (execution) => {
        console.log("Tour started, execution ID:", execution.id);
        this.router.navigate(['/tour-execution', execution.id]);
      },
      error: (err) => console.error('Error starting tour:', err)
    });
  }
}
