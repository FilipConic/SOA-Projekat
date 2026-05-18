import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../services/map.service';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  private map: any;

  @Input() mapType: 'default' | 'createWaypoint' | 'updateWaypoint' | 'showRoute' | 'showWaypoints' = 'default';
  @Input() waypoints: L.LatLng[] = [];
  @Input() waypointNames: string[] = [];
  @Input() waypointToUpdate?: L.LatLng;
  @Input() width: string = '100%';
  @Input() height: string = '500px';
  @Input() mapId: string = 'map';
  @Output() newWaypoint = new EventEmitter<L.LatLng>();
  @Output() markerClicked = new EventEmitter<number>();

  // =============== LEAF ICON SECTION ===============
  private defaultMarkerUrl: string = "https://localhost:44333/images/defaultMarker.png";
  private shadowUrl: string = "https://localhost:44333/images/shadow.png";
  private markerWidth: number = 60;
  private markerHeight: number = 60;
  private shadowWidth: number = 60;
  private shadowHeight: number = 25;
  
  // Set to default marker
  @Input() currentMarkerUrl: string | undefined;

  // Separate waypoints for routing (e.g., current location -> next keypoint)
  @Input() routeWaypoints?: L.LatLng[];

  // To be used, for example, when a waypoint is selected form a list to focus on it on the map
  @Input() focusWaypoint?: L.LatLng;

  @Input() mapCenter?: L.LatLng;

  private routeControl: any;
  private markers: L.Marker[] = [];

  private readonly DEFAULT_CENTER: L.LatLngExpression = [45.2671, 19.8335]; // Novi Sad

  private currentMarker: L.Marker | null = null;

  constructor(private mapService: MapService) {}
  
  ngOnInit(): void {
    // if parent didn't provide a URL, use the default
    this.currentMarkerUrl = this.currentMarkerUrl ?? this.defaultMarkerUrl;
  }

  // Making map react to changes in waypoints so new waypoints get rendered
  ngOnChanges(changes: SimpleChanges): void {
    // If map type changes, recreate map
    if (changes['mapType'] && !changes['mapType'].firstChange) {
      this.map?.remove();
      this.map = null;
      this.createMapType();

      this.updateMarkers();

      if (this.mapType === 'showRoute' || this.mapType === 'createWaypoint') {
        this.updateRoute();
      }

      return;
    }

    if (!this.map) return;

    // If waypoints change, update depending on map type
    if (changes['waypoints'] || changes['waypointNames']) {
      this.updateMarkers();

      if (this.mapType === 'showRoute' || this.mapType === 'createWaypoint') {
        this.updateRoute();
      }
    }

    // Handle routeWaypoints changes
    if (changes['routeWaypoints']) {
      if (this.mapType === 'showRoute' || this.mapType === 'createWaypoint') {
        this.updateRoute();
      }
    }

    // Change focus
    if (
      changes['focusWaypoint'] &&
      this.focusWaypoint &&
      this.map
    ) {
      this.map.setView([this.focusWaypoint.lat, this.focusWaypoint.lng], 16); 
    }
  }

  private updateRoute(): void {
    if (this.routeControl) {
      this.map.removeControl(this.routeControl);
    }

    // Use routeWaypoints if provided, otherwise use waypoints
    const waypointsForRoute = this.routeWaypoints && this.routeWaypoints.length >= 2 
      ? this.routeWaypoints 
      : this.waypoints;

    if (!waypointsForRoute || waypointsForRoute.length < 2) return;

    // Don't create markers in the route if we're in createWaypoint mode (markers already shown)
    const createMarkerFn = this.mapType === 'createWaypoint'
      ? () => false  // Return false to prevent route from creating markers
      : (i: number, wp: any) => L.marker(wp.latLng).bindPopup(this.waypointNames[i] || `Waypoint ${i + 1}`);

    this.routeControl = L.Routing.control({
      waypoints: waypointsForRoute,
      fitSelectedRoutes: false,
      plan: L.Routing.plan(waypointsForRoute, {
        draggableWaypoints: false,
        createMarker: createMarkerFn,
        routeWhileDragging: false
      }),
      lineOptions: {
        styles: [{ weight: 4, opacity: 0.7, color: '#2196F3' }],
        extendToWaypoints: false,
        missingRouteTolerance: 0,
        addWaypoints: false
      },
       // do NOT touch
      router: L.routing.mapbox(environment.mapboxToken, {profile: 'mapbox/walking'})
    }).addTo(this.map);
  }

  private updateMarkers(): void {
    // Remove existing markers
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    let waypointsToRender = this.waypoints;

    // If updating a waypoint, filter out the one being updated
    if (this.mapType === 'updateWaypoint' && this.waypointToUpdate) {
      waypointsToRender = this.waypoints.filter(
        wp => !wp.equals(this.waypointToUpdate!)
      );
    }

    // Add markers
    waypointsToRender.forEach((wp, i) => {
      const marker = L.marker(wp).bindPopup(this.waypointNames[i] || '');
      
      // Emit marker index when marker is clicked OR when popup opens
      marker.on('click', () => {
        console.log('Marker clicked in map component, index:', i);
        this.markerClicked.emit(i);
      });
      
      marker.on('popupopen', () => {
        console.log('Popup opened for marker, index:', i);
        this.markerClicked.emit(i);
      });
      
      marker.addTo(this.map);
      this.markers.push(marker);
    });
  }

  setRoute(waypoints: L.LatLng[]): void {
    const routeControl = L.Routing.control({
      waypoints: waypoints,
      plan: L.Routing.plan(waypoints, { draggableWaypoints: false, 
        createMarker: (i, wp) => {
        return L.marker(wp.latLng, {
          riseOnHover: true
        }).bindPopup(this.waypointNames[i] || `Waypoint ${i + 1}`);},
      }),
      lineOptions: {
        addWaypoints: false,
        styles: [{ color: 'red', opacity: 0.6, weight: 4 }],
        extendToWaypoints: false,
        missingRouteTolerance: 0,
      },
       // do NOT touch
      router: L.routing.mapbox(environment.mapboxToken, {profile: 'mapbox/walking'})
    }).addTo(this.map);

    routeControl.on('routesfound', function(e) {
      var routes = e.routes;
      var summary = routes[0].summary;
    });

    routeControl.getContainer()?.setAttribute('style', 
      'background-color: lightgray; padding: 6px; border-radius: 4px; font-size: 9px; width: 260px;');
  }

  search(address: string): void {
    this.mapService.search(address).subscribe({
      next: (result) => {
        L.marker([result[0].lat, result[0].lon])
          .addTo(this.map)
          .bindPopup(`Pozdrav iz ${address}.`)
          .openPopup();
      },
      error: () => {},
    });
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      this.mapService.reverseSearch(lat, lng).subscribe();

      if (this.currentMarker !== null) {
        this.map.removeLayer(this.currentMarker);
      }
      const mp = new L.Marker(
        [lat, lng],
        {
          icon: this.createLeafletIcon(this.currentMarkerUrl) // set marker icon
        }
      ).addTo(this.map);
      this.currentMarker = mp;

      // when new waypoint is created, emit event to parent component
      this.newWaypoint.emit(mp.getLatLng());
    });
  }

  private initMap(): void {
    this.map = L.map(this.mapId, {
      center: this.waypoints.length > 0 ? [this.waypoints[0].lat, this.waypoints[0].lng]
      : this.DEFAULT_CENTER,
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
  }

  private initClickableMap(): void {
    let mapCenter: L.LatLngExpression = this.waypointToUpdate
        ? [this.waypointToUpdate.lat, this.waypointToUpdate.lng]
        : this.DEFAULT_CENTER

    mapCenter = this.mapCenter ? [this.mapCenter.lat, this.mapCenter.lng] : this.DEFAULT_CENTER

    this.map = L.map(this.mapId, {
      center: mapCenter,
      zoom: 14,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    this.registerOnClick();
  }

  private initMapWithRoute(): void {
    this.map = L.map(this.mapId, {
      center: this.waypoints.length > 0
      ? [this.waypoints[0].lat, this.waypoints[0].lng]
      : this.DEFAULT_CENTER,
      zoom: 13,
    });

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 18 }
    ).addTo(this.map);
  }

  // Method to force map to recalculate its size
  private invalidateMapSize(): void {
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 100);
  }

  createMapType(): void {
    // create empty map, click to add waypoint
    if (this.mapType === 'createWaypoint') {
      this.initClickableMap();
      this.updateMarkers(); // Make previous markers visible while clicking
      
      // Add route if waypoints exist
      if ((this.routeWaypoints && this.routeWaypoints.length >= 2) || 
          (this.waypoints && this.waypoints.length >= 2)) {
        setTimeout(() => {
          this.updateRoute();
          this.invalidateMapSize();
        }, 100);
      } else {
        this.invalidateMapSize();
      }
      return;
    }

    // show old waypoint, click to create new one
    if (this.mapType === 'updateWaypoint' && this.waypointToUpdate)
    {
      this.initClickableMap();
      this.map.setView([this.waypointToUpdate!.lat, this.waypointToUpdate!.lng], 14);
      this.updateMarkers();
      const mp = new L.Marker(
        [this.waypointToUpdate!.lat, this.waypointToUpdate!.lng], 
        { 
          riseOnHover: true,
          icon: this.createLeafletIcon(this.currentMarkerUrl), // set marker icon
        }
      ).addTo(this.map); 
      this.currentMarker = mp;
      this.invalidateMapSize();
      return;
    }

    // map with route between waypoints
    if (this.mapType === 'showRoute') {
      this.initMapWithRoute();
      this.invalidateMapSize();
      return;
    }

    // map showing waypoints, non-clickable
    if (this.mapType === 'showWaypoints') {
      this.initMap();

      for (let wp of this.waypoints) {
        const index = this.waypoints.indexOf(wp);
        const mp = new L.Marker([wp.lat, wp.lng], 
          { riseOnHover: true }).bindPopup(
          this.waypointNames[index]
        );
        
        // Add click event to emit marker index
        mp.on('click', () => {
          console.log('Marker clicked in showWaypoints, index:', index);
          this.markerClicked.emit(index);
        });
        
        mp.on('popupopen', () => {
          console.log('Popup opened in showWaypoints, index:', index);
          this.markerClicked.emit(index);
        });
        
        mp.addTo(this.map);
      }

      // Always show route for showWaypoints
      if ((this.routeWaypoints && this.routeWaypoints.length >= 2) || 
          (this.waypoints && this.waypoints.length >= 2)) {
        setTimeout(() => {
          this.updateRoute();
          this.invalidateMapSize();
        }, 100);
      } else {
        this.invalidateMapSize();
      }
      return;
    }

    // default
    this.initMap();
    
    // Show route if waypoints exist
    if ((this.routeWaypoints && this.routeWaypoints.length >= 2) || 
        (this.waypoints && this.waypoints.length >= 2)) {
      setTimeout(() => {
        this.updateRoute();
        this.invalidateMapSize();
      }, 100);
    } else {
      this.invalidateMapSize();
    }
  }

  ngAfterViewInit(): void {
    const ratio = 1.64;
    const height = 50;
    const width = 50 / ratio;

    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      iconSize: [width, height],
      iconAnchor: [width / 2, height],
      popupAnchor: [1, -34],
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    this.createMapType();
    
    // IMPORTANT: Force map to recalculate its size after initialization
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 200);
  }

  createLeafletIcon(iconUrl?: string): L.Icon {
    return L.icon({
      iconUrl: iconUrl ?? this.defaultMarkerUrl,
      shadowUrl: this.shadowUrl,
      shadowSize: [this.shadowWidth, this.shadowHeight],
      shadowAnchor: [this.shadowWidth/2, this.shadowHeight/2 + 5],
      iconSize: [this.markerWidth, this.markerHeight],
      iconAnchor: [this.markerWidth/2, this.markerHeight],
      popupAnchor: [1, -34],
    });
  }
}