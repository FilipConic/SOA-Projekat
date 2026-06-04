import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OrderItem } from '../../models/purchase.model'; 
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-order-item-card',
  templateUrl: './order-item-card.component.html',
  styleUrls: ['./order-item-card.component.css']
})
export class OrderItemCardComponent {
  @Input() touristId!: string;
  @Input() tour!: OrderItem;
  @Output() cartUpdated = new EventEmitter<void>();
  @Output() closeDrawer = new EventEmitter<void>();

  constructor(private router: Router, private cartService: ShoppingCartService) {}

  goToDetail(): void {
    this.router.navigate(['/public/tours', this.tour.tourId]);
    this.closeDrawer.emit();
  }

  removeFromCart(event: MouseEvent): void {
    event.stopPropagation();
    
    this.cartService.removeFromCart(this.touristId, this.tour.tourId).subscribe({
      next: () => { 
        this.cartUpdated.emit(); 
      },
      error: (err) => {
        console.error('Greška pri brisanju stavke', err);
      }
    });
  }
}