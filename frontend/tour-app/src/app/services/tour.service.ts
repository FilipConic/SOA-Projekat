import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tour, ReviewTour, CreateReviewDTO } from '../models/tour.model';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  private baseUrl = 'http://localhost:8080/api/tours';

  constructor(private http: HttpClient) {}

  getAllTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.baseUrl}/all`);
  }

  getTourById(id: string): Observable<Tour> {
    return this.http.get<Tour>(`${this.baseUrl}/find/${id}`);
  }

  getReviewsByTour(tourID: string): Observable<ReviewTour[]> {
    return this.http.get<ReviewTour[]>(
      `${this.baseUrl}/reviews/${tourID}`
    );
  }

  getReviewsByTourist(touristID: string): Observable<ReviewTour[]> {
    return this.http.get<ReviewTour[]>(
      `${this.baseUrl}/tourists/reviews/${touristID}`
    );
  }

  addReview(tourID: string, review: CreateReviewDTO): Observable<ReviewTour> {
    return this.http.post<ReviewTour>(
      `${this.baseUrl}/reviews/new/${tourID}`,
      review
    ).pipe(
      catchError(err => {
        console.error('Failed to add review:', err);
        return throwError(() => err);
      })
    );
  }

  deleteReview(reviewID: string): Observable<void> {
    const token = localStorage.getItem('access-token');
    const touristID = token ? JSON.parse(atob(token.split('.')[1])).user_id : '';
    return this.http.delete<void>(
      `${this.baseUrl}/reviews/delete/${reviewID}`,
      { headers: { 'X-User-ID': touristID } }
    );
  }
}