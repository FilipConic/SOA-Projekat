import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';

// Pretpostavljena putanja do tvog servisa i modela, prilagodi ako je potrebno
import { TourExecutionService } from '../../services/tour-execution.service';
import { TourExecutionDTO, ExecutionKeyPointDTO } from '../../models/tour-execution.model';

@Component({
  selector: 'app-tour-execution',
  templateUrl: './tour-execution.component.html',
  styleUrls: ['./tour-execution.component.css']
})
export class TourExecutionComponent implements OnInit {
  execution: TourExecutionDTO | null = null;
  touristPosition: L.LatLng | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private executionService: TourExecutionService
  ) {}

  ngOnInit(): void {
    // Čupamo ID sesije iz URL-a (npr. /tour-execution/123)
    const executionId = this.route.snapshot.paramMap.get('id');
    if (executionId) {
      this.loadExecution(executionId);
    }
  }

  loadExecution(id: string): void {
    // Pretpostavljam da imaš get metodu u servisu
    this.executionService.getExecution(id).subscribe({
      next: (data) => {
        this.execution = data;
      },
      error: (err) => console.error('Greška pri učitavanju sesije:', err)
    });
  }

  // --- MAPA METODE ---

  getLeafletWaypoints(): L.LatLng[] {
    if (!this.execution) return [];
    return this.sortedKeypoints().map(kp => L.latLng(kp.latitude, kp.longitude));
  }

  getWaypointNames(): string[] {
    if (!this.execution) return [];
    return this.sortedKeypoints().map(kp => kp.name);
  }

  onMapClick(latLng: L.LatLng): void {
    if (!this.execution) return;
    
    // Čuvamo lokalno gde smo kliknuli radi nekog eventualnog UI prikaza
    this.touristPosition = latLng;

    // Šaljemo Go backendu ping sa novom pozicijom
    this.executionService.checkPosition(this.execution.id, {
      latitude: latLng.lat,
      longitude: latLng.lng
    }).subscribe({
      next: (updatedExecution) => {
        // Backend vraća ažuriran state, Angular automatski menja UI
        this.execution = updatedExecution;
        this.checkIfFinished();
      },
      error: (err) => console.error('Greška pri proveri pozicije:', err)
    });
  }

  // --- UI LOGIKA ---

  sortedKeypoints(): ExecutionKeyPointDTO[] {
    if (!this.execution || !this.execution.keypoints) return [];
    // Sortiramo kopiju niza po redu
    return [...this.execution.keypoints].sort((a, b) => a.order - b.order);
  }

  isNextPoint(kp: ExecutionKeyPointDTO): boolean {
    if (!this.execution || kp.isCompleted) return false;
    const sorted = this.sortedKeypoints();
    // Prva tačka u sortiranom nizu koja nije kompletirana je naša meta
    const nextUncompleted = sorted.find(p => !p.isCompleted);
    return nextUncompleted?.id === kp.id;
  }

  checkIfFinished(): void {
    if (!this.execution) return;
    const allDone = this.execution.keypoints.every(kp => kp.isCompleted);
    if (allDone) {
      alert('Bravo! Obišli ste sve tačke.');
    }
  }

  get isCompleteButtonDisabled(): boolean {
    if (!this.execution) return true;
    return !this.execution.keypoints.every(kp => kp.isCompleted);
  }

  completeTour(): void {
    if (!this.execution || !this.execution.keypoints.every(kp => kp.isCompleted)) return;
    this.executionService.completeTour(this.execution.id).subscribe(() => {
      this.router.navigate(['/my-tour-executions']);
    });
  }

  abandonTour(): void {
    if (!this.execution) return;
    this.executionService.abandonTour(this.execution.id).subscribe(() => {
      this.router.navigate(['/my-tour-executions']);
    });
  }
}