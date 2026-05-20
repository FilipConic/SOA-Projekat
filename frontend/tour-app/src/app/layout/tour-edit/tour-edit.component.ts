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
  tourId!: string; // PROMENJENO u string
  tourForm!: FormGroup;
  originalTour!: Tour; // Čuvamo originalnu turu kako bismo zadržali Price, Duration i ostalo
  
  keypoints: KeyPoint[] = [];
  
  // Map Variables for xp-map
  mapWaypoints: L.LatLng[] = [];
  mapWaypointNames: string[] = [];

  // Modal State
  showModal = false;
  selectedKeypoint: KeyPoint | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private tourService: TourService
  ) {}

  ngOnInit() {
    // Uzimamo ID iz rute kao string
    this.tourId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();
    this.loadTourData();
  }

  initForm() {
    this.tourForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      difficulty: ['Easy', Validators.required],
      tags: [''] // Ovo je tekstualno polje koje pretvaramo u niz pri čuvanju
    });
  }

  loadTourData() {
    // 1. Učitavanje detalja ture
    this.tourService.getTour(this.tourId).subscribe(tour => {
      this.originalTour = tour;
      
      // Ručno mapiramo PascalCase iz modela u camelCase u formi
      this.tourForm.patchValue({
        title: tour.Title,
        description: tour.Description,
        difficulty: tour.Difficulty,
        // Pretvaramo niz tagova u string odvojen zarezima (npr. "priroda, planinarenje")
        tags: tour.Tags && tour.Tags.length > 0 ? tour.Tags.join(', ') : ''
      });
    });

    // 2. Učitavanje ključnih tačaka
    this.fetchKeypoints();
  }

  fetchKeypoints() {
    this.tourService.getKeypoints(this.tourId).subscribe(kp => {
      this.keypoints = kp;
      console.log("Učitane ključne tačke:", this.keypoints);
      this.updateMapData();
    });
  }

  updateMapData() {
    // Koristimo veliko početno slovo za Latitude i Longitude (PascalCase)
    this.mapWaypoints = this.keypoints.map(kp => L.latLng(kp.Latitude, kp.Longitude));
    this.mapWaypointNames = this.keypoints.map(kp => kp.Name);
  }

  saveMainDetails() {
    if (this.tourForm.valid) {
      const formValues = this.tourForm.value;
      
      // Kreiramo UpdateTourDTO koji zadržava i nepromenjena polja (Price, Duration, Status)
      const updatePayload: UpdateTourDTO = {
        Title: formValues.title,
        Description: formValues.description,
        Difficulty: formValues.difficulty,
        // Razbijamo string nazad u niz, eliminišemo prazna mesta
        Tags: formValues.tags 
          ? formValues.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '')
          : [],
        Price: this.originalTour?.Price || 0,
        Duration: this.originalTour?.Duration || 0,
        // Kastujemo string da zadovolji union tip 'draft' | 'published' | 'archived'
        Status: (this.originalTour?.Status as any) || 'draft'
      };

      // Pretpostavljam da servis očekuje ID (string) i DTO
      this.tourService.updateTour(this.tourId, updatePayload)
        .subscribe(() => alert('Detalji ture uspešno sačuvani!'));
    }
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
}