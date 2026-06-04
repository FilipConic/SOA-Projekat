import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from 'src/app/services/tour.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { Tour } from 'src/app/models/tour.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css']
})
export class TourDetailsComponent implements OnInit {
  tour!: Tour;
  touristId!: string;

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService,
    private cartService: ShoppingCartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.tourService.getTour(id).subscribe({
      next: (data) => {
        this.tour = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  addToCart(): void {
    this.cartService.addToCart(this.tour.id, this.tour.Title, this.tour.Price).subscribe({
      next: () => {
        alert('Tour added to cart!');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}