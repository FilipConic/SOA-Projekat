import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { TouristPositionService } from '../../services/tourist-position.service';

@Component({
  selector: 'xp-position-simulator',
  templateUrl: './position-simulator.component.html',
  styleUrls: ['./position-simulator.component.css']
})
export class PositionSimulatorComponent implements OnInit {
  currentPosition: L.LatLng | null = null;

  constructor(
    private positionService: TouristPositionService,
  ) {}

onMapClick(latlng: L.LatLng): void {
    this.positionService.setPosition(latlng);
    this.currentPosition = this.positionService.getPosition();
  }

  ngOnInit(): void {
    this.currentPosition = this.positionService.getPosition();
  }
}
