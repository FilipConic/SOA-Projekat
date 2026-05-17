import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) {}

  search(street: string): Observable<any> {
    return this.http.get(
      'https://nominatim.openstreetmap.org/search?format=json&q=' + street
    );
  }

  reverseSearch(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&<params>`
    );
  }

  getTotalDistance(waypoints: L.LatLng[]): number {
    if (!waypoints || waypoints.length < 2) return 0;

    let total = 0;
    for (let i = 1; i < waypoints.length; i++) {
      total += waypoints[i - 1].distanceTo(waypoints[i]);
    }
    return total;
  }
}
