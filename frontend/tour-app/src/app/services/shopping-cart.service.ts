import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ShoppingCart, CheckoutResponse } from '../models/purchase.model'; 
import { environment } from 'src/env/environment';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  cartState = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  toggleCart() : void {
    this.cartState.next(!this.cartState.value);
  }

  getCart(touristId: number): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(`${environment.apiHost}purchase/cart/${touristId}`);
  }

  addToCart(touristId: number, tourId: number): Observable<ShoppingCart> {
    const payload = { touristId, tourId };
    return this.http.post<ShoppingCart>(`${environment.apiHost}purchase/cart/add`, payload).pipe(
      tap(() => this.cartState.next(true))
    );
  }

  removeFromCart(touristId: number, tourId: number): Observable<ShoppingCart> {
    return this.http.delete<ShoppingCart>(`${environment.apiHost}purchase/cart/remove?touristId=${touristId}&tourId=${tourId}`);
  }

  checkout(touristId: number): Observable<CheckoutResponse> {
    const payload = { touristId };
    return this.http.post<CheckoutResponse>(`${environment.apiHost}purchase/checkout`, payload);
  }
}