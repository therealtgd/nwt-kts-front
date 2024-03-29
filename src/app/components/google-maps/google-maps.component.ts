import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { LatLng, LatLngLiteral } from 'ngx-google-places-autocomplete/objects/latLng';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

import { AddressDto } from 'src/app/dto/address-dto';
import { ActiveRide } from 'src/app/models/active-ride';
import { Driver } from 'src/app/models/driver';
import { DriverService } from 'src/app/services/driver/driver.service';
import { getSession } from 'src/app/util/context';

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
  @Input() stops: AddressDto[] | null = [];
  @Input() initSocket: boolean = true;
  @Output() onRideInfoChanged = new EventEmitter<any>();
  @Input() useNgOnChanges: boolean = false;
  @ViewChild(GoogleMap) map!: GoogleMap;
  options!: google.maps.MapOptions;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;


  drivers: { [id: number]: Driver } = {}
  driverMarkers: { [driver_id: number]: google.maps.Marker | null } = {};

  private stompClient!: Stomp.Client;

  ngOnChanges() {
    if (this.useNgOnChanges) {
      this.pickupLocation?.lat !== 0 && this.destination?.lat !== 0 && this.setRoutePolyline();
    }
  }

  ngOnInit() {
    this.options = {
      center: { lat: 45.24755837792679, lng: 19.827395671336852 },
      zoom: 13,
      restriction: {
        latLngBounds: {
          north: 45.4163067202218,
          south: 45.102887840869684,
          east: 20.097893163467827,
          west: 19.53315013570948
        },
        strictBounds: true,
      },
      disableDefaultUI: true,
    };
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();

    this.initSocket && this.initializeWebSocketConnection();
    this.pickupLocation?.lat !== 0 && this.destination?.lat !== 0 && this.setRoutePolyline();
  }


  initializeWebSocketConnection() {
    this.stompClient = Stomp.over(new SockJS('http://localhost:8080/socket'));
    this.stompClient.connect({}, () => { this.openGlobalSocket(); });
    this.stompClient.debug = () => { };
  }

  openGlobalSocket() {
    this.stompClient.subscribe('/map-updates/update-drivers-status-and-position', (message: { body: string }) => {
      const drivers: Driver[] = JSON.parse(message.body);
      const newDriverIds: number[] = [];
      for (const driver of drivers) {
        newDriverIds.push(driver.id);

        let image: string;
        if (getSession()?.role === 'ROLE_DRIVER' && getSession()?.username === driver.username) {
          image = 'assets/car-blue.png';
        }
        else if (driver.status === 'AVAILABLE') {
          image = 'assets/car-green.png';
        }
        else {
          image = 'assets/car-red.png';
        }

        let icon = { scaledSize: new google.maps.Size(40, 51), url: image };
        if (!(driver.id in this.driverMarkers) || this.driverMarkers[driver.id] === null) {
          this.driverMarkers[driver.id] = new google.maps.Marker({
            position: driver.vehicle.position,
            map: this.map.googleMap,
            icon,
          });
        }
        else {
          this.driverMarkers[driver.id]?.setIcon(icon);
          this.driverMarkers[driver.id]?.setPosition(driver.vehicle.position);
        }
      }

      const currentDriverIds = Object.keys(this.driverMarkers).map(key => Number(key));
      const nonActiveDriverIds = currentDriverIds.filter(x => !newDriverIds.includes(x));
      for (const driverId of nonActiveDriverIds) {
        this.driverMarkers[driverId]?.setMap(null);
        delete this.driverMarkers[driverId];
      }
    });

    if (getSession()?.role === 'ROLE_DRIVER') {
      this.stompClient.subscribe('/driver/active-ride/' + getSession()?.username, (message: { body: string }) => {
        const ride: ActiveRide = JSON.parse(message.body);
        this.simulateDrive(ride.driver.vehicle.position, ride.startAddress.coordinates);
      });
      this.stompClient.subscribe('/driver/ride-started/' + getSession()?.username, (message: { body: string }) => {
        const ride: ActiveRide = JSON.parse(message.body);
        const stops = ride.stops.map(stop => ({
          location: stop.coordinates,
          stopover: true
        }));
        this.simulateDrive(ride.driver.vehicle.position, ride.endAddress.coordinates, stops);
      });
    }
  }

  simulateDrive(
    currentPosition: google.maps.LatLngLiteral,
    clientPosition: google.maps.LatLngLiteral,
    stops?: google.maps.DirectionsWaypoint[]
  ) {
    let request: google.maps.DirectionsRequest = {
      origin: currentPosition,
      destination: clientPosition,
      waypoints: stops,
      travelMode: google.maps.TravelMode.DRIVING,
    };
    this.directionsService.route(request, (res, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setMap(this.map.googleMap ?? null);
        this.directionsRenderer.setDirections(res);

        const legs = res?.routes[0].legs;
        if (legs) {
          let polyline: LatLngLiteral[] = [];
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
          if (stops !== undefined) {
            this.driverService.postSimulateDrive(polyline);
          } else {
            this.driverService.postSimulateDriveToClient(polyline);
          }
        }
      }
    });
  }

  setRoutePolyline() {
    if (this.pickupLocation && this.destination) {
      let request = {
        origin: this.pickupLocation,
        destination: this.destination,
        waypoints: this.stops && this.stops.length > 0? this.stops.map(stop => ({
          location: stop.address,
          stopover: true
        })) : [],
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
              address: legs[legs.length === 1 ? 0 : legs.length - 1].end_address,
              coordinates: {
                lat: legs[legs.length === 1 ? 0 : legs.length - 1].end_location.lat(),
                lng: legs[legs.length === 1 ? 0 : legs.length - 1].end_location.lng()
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
          }
        } else {
          console.warn('Something went wrong')
        }
      })
    }
  }
}
