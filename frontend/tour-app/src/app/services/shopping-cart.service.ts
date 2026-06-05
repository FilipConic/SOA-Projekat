import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ShoppingCart, CheckoutResponse } from '../models/purchase.model'; 
import { environment } from 'src/env/environment';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  constructor(private http: HttpClient) {}

  getCart(touristId: string): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(`${environment.apiHost}purchase/cart/get`);
  }

  addToCart(tourId: string, tourName: string, price: number): Observable<ShoppingCart> {
    const payload = { tourId, tourName, price };
    return this.http.post<ShoppingCart>(`http://localhost:8080/v1/purchase/cart/add`, payload);
  }

  removeFromCart(tourId: string): Observable<ShoppingCart> {
    return this.http.delete<ShoppingCart>(`${environment.apiHost}purchase/cart/remove?tourId=${tourId}`);
  }

  checkout(): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`http://localhost:8080/v1/purchase/checkout`, {});
  }
}