import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as L from 'leaflet';

@Injectable({ providedIn: 'root' })
export class TouristPositionService {
  private positionSubject = new BehaviorSubject<L.LatLng | null>(null);
  position$ = this.positionSubject.asObservable();

  setPosition(latlng: L.LatLng): void {
    this.positionSubject.next(L.latLng(latlng.lat, latlng.lng));
  }

  getPosition(): L.LatLng | null {
    return this.positionSubject.getValue();
  }
}
