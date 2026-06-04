import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { TourService } from '../../services/tour.service';
import { Tour, KeyPoint, UpdateTourDTO } from '../../models/tour.model';

@Component({
  selector: 'app-tour-edit',
  templateUrl: './tour-edit.component.html',
  styleUrls: ['./tour-edit.component.css']
})
export class TourEditComponent implements OnInit {
  tourId!: string;
  tourForm!: FormGroup;
  originalTour!: Tour; // cuvamo originalnu turu kako bismo zadržali Price, Duration i ostalo
  
  keypoints: KeyPoint[] = [];
  
  // Map Variables for xp-map
  mapWaypoints: L.LatLng[] = [];
  mapWaypointNames: string[] = [];

  // Modal State
  showModal = false;
  selectedKeypoint: KeyPoint | null = null;

  distanceKm: number = 0;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private tourService: TourService
  ) {}

  ngOnInit() {
    this.tourId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();
    this.loadTourData();
  }

  initForm() {
    this.tourForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      difficulty: ['Easy', Validators.required],
      tags: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: [0, [Validators.required, Validators.min(1)]]
    });
  }

  loadTourData() {
    this.tourService.getTour(this.tourId).subscribe(tour => {
      this.originalTour = tour;
      
      this.tourForm.patchValue({
        title: tour.Title,
        description: tour.Description,
        difficulty: tour.Difficulty,
        tags: tour.Tags && tour.Tags.length > 0 ? tour.Tags.join(', ') : '',
        price: tour.Price,
        duration: tour.Duration
      });
    });

    this.fetchKeypoints();
  }

  fetchKeypoints() {
    this.tourService.getKeypoints(this.tourId).subscribe(kp => {
      this.keypoints = kp;
      console.log("Učitane ključne tačke:", this.keypoints);
      this.updateMapData();

      this.distanceKm = this.calculateDistance();
    });
  }

  updateMapData() {
    this.mapWaypoints = this.keypoints.map(kp => L.latLng(kp.Latitude, kp.Longitude));
    this.mapWaypointNames = this.keypoints.map(kp => kp.Name);
  }

  saveMainDetails() {
    if (this.tourForm.valid) {
      const formValues = this.tourForm.value;
      
      const updatePayload: UpdateTourDTO = {
        Title: formValues.title,
        Description: formValues.description,
        Difficulty: formValues.difficulty,
        Tags: formValues.tags 
          ? formValues.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '')
          : [],
        Price: formValues.price,
        Duration: formValues.duration,
        Status: (this.originalTour?.Status as any) || 'draft',
        distance_km: this.distanceKm
      };
      console.log("Payload za ažuriranje ture:", updatePayload);

      this.tourService.updateTour(this.tourId, updatePayload)
        .subscribe(() => alert('Detalji ture uspešno sačuvani!'));
    }
  }

  canPublish(): boolean {
    const f = this.tourForm.value;
    return (
      !!f.title &&
      !!f.description &&
      !!f.difficulty &&
      f.duration > 0 &&
      this.keypoints.length >= 2
    );
  }

  publishTour() {
    if (!this.canPublish()) return;
    const formValues = this.tourForm.value;
    const updatePayload: UpdateTourDTO = {
      Title: formValues.title,
      Description: formValues.description,
      Difficulty: formValues.difficulty,
      Tags: formValues.tags
        ? formValues.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '')
        : [],
      Price: formValues.price,
      Duration: formValues.duration,
      Status: 'published'
    };
    this.tourService.updateTour(this.tourId, updatePayload)
      .subscribe(() => {
        this.originalTour.Status = 'published';
        alert('Tura uspešno objavljena!');
      });
  }

  // --- Modal Logic ---
  openCreateModal() {
    this.selectedKeypoint = null;
    this.showModal = true;
  }

  openEditModal(keypoint: KeyPoint) {
    this.selectedKeypoint = keypoint;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedKeypoint = null;
  }

  onKeypointSaved() {
    this.closeModal();
    this.fetchKeypoints(); // Refresh list & map after save
  }

  deleteKeypoint(id: string) {
    if (!id) return;
    
    if (confirm("Are you sure you want to delete this keypoint?")) {
      this.tourService.deleteKeypoint(id).subscribe(() => {
        this.fetchKeypoints();
      });
    }
  }

  calculateDistance(): number {
    let total = 0;

    for (let i = 1; i < this.mapWaypoints.length; i++) {
      const a = this.mapWaypoints[i - 1];
      const b = this.mapWaypoints[i];

      total += this.getDistanceMeters(
      a.lat, a.lng,
      b.lat, b.lng
    );
    }
    return total/1000; // Convert to km
  }

  private getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    // Haversine formula
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }
}