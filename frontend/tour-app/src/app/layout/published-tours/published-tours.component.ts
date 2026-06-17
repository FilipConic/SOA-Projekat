import { Component, OnInit } from '@angular/core';
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour.service';

@Component({
  selector: 'app-published-tours',
  templateUrl: './published-tours.component.html',
  styleUrls: ['./published-tours.component.css']
})
export class PublishedToursComponent implements OnInit {
  tours: Tour[] = [];

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.loadTours();
  }

  loadTours(): void {
    this.tourService.getAvailableTours().subscribe({
      next: (data) => {
        this.tours = data.filter(tour => tour.status === 'published');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
