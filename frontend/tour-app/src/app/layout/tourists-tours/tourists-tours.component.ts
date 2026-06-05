import { Component, OnInit } from '@angular/core';
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour.service';

@Component({
  selector: 'app-tourists-tours',
  templateUrl: './tourists-tours.component.html',
  styleUrls: ['./tourists-tours.component.css']
})
export class TouristsToursComponent implements OnInit {
  purchasedTours: Tour[] = [];

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.loadPurchasedTours();
  }

  loadPurchasedTours(): void {
    this.tourService.getPurchasedTours().subscribe({
      next: (data) => {
        this.purchasedTours = data;
      },
      error: (err) => {
        console.error('Greška prilikom učitavanja kupljenih tura:', err);
      }
    });
  }
}