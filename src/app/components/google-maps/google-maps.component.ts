import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { LatLng, LatLngLiteral } from 'ngx-google-places-autocomplete/objects/latLng';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

import { Driver } from 'src/app/models/driver';
import { Stop } from 'src/app/models/stop';
import { Vehicle } from 'src/app/models/vehicle';
import { DriverService } from 'src/app/services/driver/driver.service';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements OnInit {

  constructor(
    private driverService: DriverService,
  ) { }

  @Input() pickupLocation: LatLngLiteral | null = null;
  @Input() destination: LatLngLiteral | null = null;
  @Input() stops: Stop[] = [];
  @Output() onRideInfoChanged = new EventEmitter<any>();
  @ViewChild(GoogleMap) map!: GoogleMap;
  options!: google.maps.MapOptions;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;

  markers: any = [];

  drivers: { [id: number]: Driver } = {}
  vehicles: { [key: number]: Vehicle } = {}
  vehicle_markers: { [vehicle_id: number]: google.maps.Marker } = {};

  private stompClient!: Stomp.Client;

  ngOnChanges() {
    this.pickupLocation && this.destination && this.setRoutePolyline();
  }

  ngOnInit() {
    this.options = {
      center: { lat: 45.24755837792679, lng: 19.827395671336852 },
      zoom: 13,
      restriction: {
        latLngBounds: {
          north: 45.33871095236587,
          south: 45.21794541928532,
          east: 19.91827998750687,
          west: 19.688449296530184
        },
        strictBounds: true,
      },
      streetViewControl: false,
    };
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();

    this.initializeWebSocketConnection();
    this.driverService.getAllActiveDrivers().subscribe((ret: any) => {
      for (const driver of ret.body) {
        this.drivers[driver.id] = driver;
        let icon = {
          url: 'assets/car.png',
          scaledSize: new google.maps.Size(40, 51),
        }
        this.vehicle_markers[driver.vehicle.id] = new google.maps.Marker({
          position: driver.vehicle.position,
          map: this.map.googleMap,
          icon,
        })
      }
    });
  }

  initializeWebSocketConnection() {
    this.stompClient = Stomp.over(new SockJS('http://localhost:8080/socket'));
    this.stompClient.connect({}, () => { this.openGlobalSocket(); });
    this.stompClient.debug = () => { };
  }

  openGlobalSocket() {
    this.stompClient.subscribe('/map-updates/update-vehicle-position', (message: { body: string }) => {
      let vehicle: Vehicle = JSON.parse(message.body);
      this.vehicle_markers[vehicle.id].setPosition(vehicle.position);
    });
  }

  dropMarker(coordinates: LatLngLiteral) {
    this.markers.push({
      position: {
        lat: coordinates.lat,
        lng: coordinates.lng,
      },
      options: {
        animation: google.maps.Animation.DROP,
      },
    })
  }

  setRoutePolyline() {
    if (this.pickupLocation && this.destination) {
      let request = {
        origin: this.pickupLocation,
        destination: this.destination,
        waypoints: this.stops.map(stop => ({
          location: stop.address.formatted_address,
          stopover: true
        })),
        travelMode: google.maps.TravelMode.DRIVING,
      };

      this.directionsService.route(request, (response, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setMap(this.map.googleMap ?? null);
          this.directionsRenderer.setDirections(response);

          const legs = response?.routes[0].legs;
          if (legs) {
            const startAddress = {
              address: legs[0].start_address,
              coordinates: {
                lat: legs[0].start_location.lat(),
                lng: legs[0].start_location.lng()
              }
            };
            const endAddress = {
              address: legs[legs.length - 1].end_address,
              coordinates: {
                lat: legs[legs.length - 1].start_location.lat(),
                lng: legs[legs.length - 1].start_location.lng()
              }
            };
            const distance = legs.map(leg => leg.distance!.value).reduce((acc, current) => acc + current, 0);
            const duration = legs.map(leg => leg.duration!.value).reduce((acc, current) => acc + current, 0);

            this.onRideInfoChanged.emit({
              distance: distance,
              duration: duration,
              startAddress,
              endAddress,
            });

            // TODO: This should only be used and saved if user is Driver
            let polyline: LatLngLiteral[] = []
            for (let i = 0; i < legs.length; i++) {
              const steps = legs[i].steps;
              for (let j = 0; j < steps.length; j++) {
                let nextSegment = steps[j].path;
                for (let k = 0; k < nextSegment.length; k++) {
                  let coords: LatLng = nextSegment[k];
                  polyline.push({ lat: coords.lat(), lng: coords.lng() });
                }
              }
            }
          }
        } else {
          console.warn('Something went wrong')
        }
      })
    }
  }
}
