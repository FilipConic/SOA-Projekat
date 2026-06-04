import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { TourExecutionDTO, ExecutionKeyPointDTO, PositionDTO } from '../models/tour-execution.model';

// --- SERVIS ---
@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  // Pretpostavka je da environment.apiHost iznosi 'http://localhost:8080' ili slično
  private readonly baseUrl = `${environment.apiHost}tours/tour-executions`;

  constructor(private http: HttpClient) {}

  /**
   * Dohvata podatke o trenutnoj sesiji (neophodno za učitavanje komponente).
   * Pretpostavljeni endpoint: GET /api/tour-executions/{id}
   */
  getExecution(executionId: number | string): Observable<TourExecutionDTO> {
    return this.http.get<TourExecutionDTO>(`${this.baseUrl}/find/${executionId}`);
  }

  getMyTourExecutions(): Observable<TourExecutionDTO[]> {
    return this.http.get<TourExecutionDTO[]>(`${this.baseUrl}/my`);
  }

  /**
   * Pokreće novu turu za turistu.
   * POST /api/tour-executions/start/{tour_id}
   */
  startTour(tourId: number | string): Observable<TourExecutionDTO> {
    // Ako body nije potreban, šaljemo prazan objekat {}
    return this.http.post<TourExecutionDTO>(`${this.baseUrl}/start/${tourId}`, {});
  }

  /**
   * Šalje trenutnu poziciju turiste i proverava da li je prišao ključnoj tački.
   * PUT /api/tour-executions/check-position/{id}
   */
  checkPosition(executionId: number | string, position: PositionDTO): Observable<TourExecutionDTO> {
    return this.http.put<TourExecutionDTO>(`${this.baseUrl}/check-position/${executionId}`, position);
  }

  /**
   * Ručno završava turu (ako su sve tačke obišle).
   * PUT /api/tour-executions/complete/{id}
   */
  completeTour(executionId: number | string): Observable<TourExecutionDTO> {
    return this.http.put<TourExecutionDTO>(`${this.baseUrl}/complete/${executionId}`, {});
  }

  /**
   * Odustajanje od ture.
   * PUT /api/tour-executions/abandon/{id}
   */
  abandonTour(executionId: number | string): Observable<TourExecutionDTO> {
    return this.http.put<TourExecutionDTO>(`${this.baseUrl}/abandon/${executionId}`, {});
  }
}