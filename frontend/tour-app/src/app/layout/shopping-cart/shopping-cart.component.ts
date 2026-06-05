import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service'; 
import { AuthService } from '../../services/auth.service'; // Prilagodi putanju tvom AuthService-u
import { ShoppingCart, OrderItem } from '../../models/purchase.model'; // Prilagodi putanju modelima

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cart: ShoppingCart | null = null;
  touristId: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private cartService: ShoppingCartService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    // Pretplatimo se na ulogovanog korisnika da bismo dobili njegov ID
    this.authService.user$.subscribe({
      next: (user) => {
        if (user && user.id) {
          this.touristId = user.id.toString();
          this.loadCart();
        } else {
          this.isLoading = false;
          this.errorMessage = 'Morate biti ulogovani da biste videli korpu.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Greška pri autentifikaciji.';
      }
    });
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart(this.touristId).subscribe({
      next: (cartData: ShoppingCart) => {
        this.cart = cartData;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Greška pri dobavljanju korpe:', err);
        this.errorMessage = 'Nije moguće učitati stavke iz korpe.';
        this.isLoading = false;
      }
    });
  }

  removeItem(itemId: number | undefined): void {
    if (!itemId) return;
    
    this.cartService.removeFromCart(itemId.toString()).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Cannot remove item from cart.';
      }
    });
  }

  checkout(): void {
    this.cartService.checkout().subscribe({
      next: () => {
        alert('Success!');
        this.loadCart();
      },
      error: (err) => {
        console.error('Greška pri kupovini:', err);
        alert('An error occurred, please try again later.');
      }
    });
  }
}