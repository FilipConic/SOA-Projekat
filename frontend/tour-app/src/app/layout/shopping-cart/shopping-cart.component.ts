import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCart } from '../../models/purchase.model'; 
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { AuthService } from 'src/app/layout/services/auth.service'; 

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  isOpen = false;
  cart: ShoppingCart | null = null;
  touristId!: number;
  isProcessing = false;

  constructor(
    private router: Router,
    private cartService: ShoppingCartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user && user.role === 'tourist') {
        this.touristId = user.id;
      }
    });

    this.cartService.cartState.subscribe(state => {
      this.isOpen = state;
      if (this.isOpen && this.touristId) {
        this.loadCart();
      }
    });
  }

  loadCart(): void {
    this.cartService.getCart(this.touristId).subscribe({
      next: (cart) => {
        this.cart = cart;
      },
      error: (err) => {
        console.error('Greška pri učitavanju korpe', err);
      }
    });
  }

  toggleDrawer(): void {
    this.cartService.toggleCart();
  }

  goToTours(): void {
    this.router.navigate(['/public/tours']);
    this.toggleDrawer();
  }

  checkout(): void {
    if (!this.cart || this.cart.items.length === 0) return;

    this.isProcessing = true;

    this.cartService.checkout(this.touristId).subscribe({
      next: (response) => {
        this.isProcessing = false;
        this.toastService.success(response.message || 'Kupovina uspešno završena!');
        
        this.toggleDrawer();
        this.cart = null; 
        
        this.router.navigate(['/my-tours']);
      },
      error: (err) => {
        this.isProcessing = false;
        this.toastService.error(err?.error?.message || 'Došlo je do greške prilikom kupovine.');
      }
    });
  }
}