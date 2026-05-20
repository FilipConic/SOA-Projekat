import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KeyPoint, CreateKeyPointDTO, UpdateKeyPointDTO } from '../../models/tour.model';
import { TourService } from '../../services/tour.service';
import * as L from 'leaflet'; // Uvozimo Leaflet jer mapa zahteva L.LatLng objekte

@Component({
  selector: 'app-keypoint-modal',
  templateUrl: './keypoint-modal.component.html',
  styleUrls: ['./keypoint-modal.component.css']
})
export class KeypointModalComponent implements OnInit {
  @Input() tourId!: string; 
  @Input() keypointData: KeyPoint | null = null; 
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<KeyPoint>();

  keypointForm!: FormGroup;
  base64ImageStr: string = ''; 
  imagePreview: string | null = null; 

  // --- Svojstva prilagođena tipovima iz tvoje xp-map komponente ---
  modalMapType: 'default' | 'createWaypoint' | 'updateWaypoint' | 'showRoute' | 'showWaypoints' = 'createWaypoint';
  modalWaypoints: L.LatLng[] = [];
  modalWaypointToUpdate?: L.LatLng;

  constructor(private fb: FormBuilder, private tourService: TourService) {}

  ngOnInit() {
    this.initForm();
    
    if (this.keypointData?.Image) {
      this.imagePreview = this.keypointData.Image;
    }

    // Ako menjamo postojeću tačku, pretvaramo koordinate u L.LatLng objekte
    if (this.keypointData) {
      this.modalMapType = 'updateWaypoint';
      
      // Kreiramo Leaflet LatLng instancu
      const existingLocation = L.latLng(this.keypointData.Latitude, this.keypointData.Longitude);
      
      this.modalWaypoints = [existingLocation];
      this.modalWaypointToUpdate = existingLocation;
    }
  }

  initForm() {
    this.keypointForm = this.fb.group({
      name: [this.keypointData?.Name || '', Validators.required],
      description: [this.keypointData?.Description || '', Validators.required],
      latitude: [this.keypointData?.Latitude || null, Validators.required],
      longitude: [this.keypointData?.Longitude || null, Validators.required]
    });
  }

  // Tvoja xp-map komponenta kroz newWaypoint emituje L.LatLng objekat
  onMapClick(coord: L.LatLng) {
    if (!coord) return;

    // Iz L.LatLng objekta bezbedno uzimamo .lat i .lng svojstva
    this.keypointForm.patchValue({
      latitude: coord.lat,
      longitude: coord.lng
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) {
      return;
    }

    console.log('Izabran je fajl:', file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      this.imagePreview = resultStr; 
      this.base64ImageStr = resultStr; 
    };
    
    reader.onerror = (error) => {
      console.error('Greška pri čitanju fajla:', error);
    };

    reader.readAsDataURL(file); 
  }

  onSave() {
      // Označavamo sva polja kao taknuta (touched) da bi se prikazale crvene poruke ako ih ima
    this.keypointForm.markAllAsTouched();

    // Ako je forma nevalidna, ispisujemo u konzoli tačan razlog umesto da ćutimo
    if (this.keypointForm.invalid) {
      console.warn('Forma je nevalidna! Proveri unose:', this.keypointForm.value);
      alert('Please fill in all required fields and select a location on the map.');
      return;
    }

    console.log('Forma je validna. Šaljem podatke na server...');

    if (this.keypointData?.ID) {
      const updatePayload: UpdateKeyPointDTO = {
        Name: this.keypointForm.value.name,
        Description: this.keypointForm.value.description,
        Latitude: this.keypointForm.value.latitude,
        Longitude: this.keypointForm.value.longitude,
        Image: this.base64ImageStr || undefined
      };

      this.tourService.updateKeypoint(this.tourId, this.keypointData.ID, updatePayload)
        .subscribe({
          next: (res) => this.saved.emit(res),
          error: (err) => console.error('Greška pri izmeni ključne tačke:', err)
        });

    } else {
      const createPayload: CreateKeyPointDTO = {
        Name: this.keypointForm.value.name,
        Description: this.keypointForm.value.description,
        Latitude: this.keypointForm.value.latitude,
        Longitude: this.keypointForm.value.longitude,
        Image: this.base64ImageStr
      };

      this.tourService.createKeypoint(this.tourId, createPayload)
        .subscribe({
          next: (res) => this.saved.emit(res),
          error: (err) => console.error('Greška pri kreiranju ključne tačke:', err)
        });
    }
  }
}