import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Tour, 
  ReviewTour, 
  CreateReviewDTO, 
  CreateTourDTO, 
  UpdateTourDTO, // Uvezen DTO za izmenu ture
  KeyPoint, 
  CreateKeyPointDTO, 
  UpdateKeyPointDTO 
} from '../models/tour.model';
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

  // NOVO: Dobavljanje svih tura koje je kreirao trenutno ulogovani autor
  // Ruta na bekendu: GET /api/tours/find-my
  getMyTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.baseUrl}/find-my`);
  }

  createTour(newTour: CreateTourDTO): Observable<Tour> {
    return this.http.post<Tour>(`${this.baseUrl}/new`, newTour);
  }

  // NOVO: Izmena glavnih detalja ture (izmena naziva, opisa, tezine, tagova...)
  // Ruta na bekendu: PUT /api/tours/update/{tour_id}
  updateTour(tourId: string, updatedTour: UpdateTourDTO): Observable<Tour> {
    return this.http.put<Tour>(`${this.baseUrl}/update/${tourId}`, updatedTour);
  }

  // PROMENJENO: Preimenovano iz getTourById u getTour da odgovara tour-edit komponenti
  // Ruta na bekendu: GET /api/tours/find/{tour_id}
  getTour(id: string): Observable<Tour> {
    return this.http.get<Tour>(`${this.baseUrl}/find/${id}`);
  }

  // ================= KLJUČNE TAČKE (KEYPOINTS) =================

  // NOVO: Dobavljanje svih ključnih tačaka za određenu turu (kako bi ih xp-map iscrtao)
  // Ruta na bekendu: GET /api/tours/keypoints/find/{tour_id}
  getKeypoints(tourId: string): Observable<KeyPoint[]> {
    return this.http.get<KeyPoint[]>(`${this.baseUrl}/keypoints/find/${tourId}`);
  }

  createKeypoint(tourId: string, keypoint: CreateKeyPointDTO): Observable<KeyPoint> {
    return this.http.post<KeyPoint>(`${this.baseUrl}/keypoints/new/${tourId}`, keypoint);
  }

  updateKeypoint(tourId: string, kpId: string, keypoint: UpdateKeyPointDTO): Observable<KeyPoint> {
    return this.http.put<KeyPoint>(`${this.baseUrl}/keypoints/update/${tourId}/${kpId}`, keypoint);
  }

  // NOVO: Brisanje ključne tačke sa kartice
  // Ruta na bekendu: DELETE /api/tours/keypoints/delete/{id}
  deleteKeypoint(kpId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/keypoints/delete/${kpId}`);
  }

  // ================= RECENZIJE (REVIEWS) =================

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