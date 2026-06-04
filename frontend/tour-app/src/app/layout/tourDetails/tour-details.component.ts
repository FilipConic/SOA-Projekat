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
    this.authService.user$.subscribe({
      next: (user) => {
        if (user && user.role === 'tourist') {
          this.touristId = String(user.id);
        }
      }
    });

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
    if (!this.touristId) {
      return;
    }

    this.cartService.addToCart(this.touristId, this.tour.id).subscribe({
      next: () => {},
      error: (err) => {
        console.error(err);
      }
    });
  }
}