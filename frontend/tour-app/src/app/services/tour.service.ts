import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tour } from '../models/tour.model';


@Injectable({
  providedIn: 'root'
})
export class TourService {

  private baseUrl = 'http://localhost:8082/api/tours';

  constructor(private http: HttpClient) {}

  getAllTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.baseUrl}/find-all`);
  }

  getTourById(id: string): Observable<Tour> {
    return this.http.get<Tour>(`${this.baseUrl}/find/${id}`);
  }
}