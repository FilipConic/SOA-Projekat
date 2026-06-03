import { Component, OnInit } from '@angular/core';
import { Tour } from '../../models/purchase.model';
import { TourService } from '../../services/tour.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ToastService } from 'src/app/shared/toasts/toast.service';

@Component({
  selector: 'app-published-tours',
  templateUrl: './published-tours.component.html',
  styleUrls: ['./published-tours.component.css']
})
export class PublishedToursComponent implements OnInit {
  tours: Tour[] = [];
  touristId!: number;

  constructor(
    private tourService: TourService,
    private cartService: ShoppingCartService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe({
      next: (user) => {
        if (user && user.role === 'tourist') {
          this.touristId = user.id;
          this.loadTours();
        }
      },
      error: (err) => console.error('Greška pri proveri korisnika:', err)
    });
  }

  loadTours(): void {
    this.tourService.getTours().subscribe({
      next: (data) => {
        
        this.tours = data;
      },
      error: (err) => {
        this.toastService.error('Neuspešno učitavanje dostupnih tura.');
        console.error(err);
      }
    });
  }

  addToCart(tour: Tour): void {
    if (!this.touristId) {
      this.toastService.error('Morate biti ulogovani kao turista da biste dodali turu u korpu.');
      return;
    }

    this.cartService.addToCart(this.touristId, tour.id).subscribe({
      next: (updatedCart) => {
        this.toastService.success(`Tura "${tour.name}" je dodata u korpu.`);
       },
      error: (err) => {
        const backendMessage = err?.error?.message || '';
        if (err.status === 409 || backendMessage.includes('already')) {
          this.toastService.error('Ova tura se već nalazi u Vašoj korpi ili je već kupljena.');
        } else {
          this.toastService.error('Greška prilikom dodavanja u korpu.');
        }
        console.error(err);
      }
    });
  }
}