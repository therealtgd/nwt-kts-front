import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { LatLngLiteral } from 'ngx-google-places-autocomplete/objects/latLng';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements OnInit {

  @ViewChild(GoogleMap) map!: GoogleMap;
  options!: google.maps.MapOptions;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;

  markers: any[] = [];

  private _pickupLocation!: LatLngLiteral | null;
  @Input() set pickupLocation(value: LatLngLiteral | null) {
    this._pickupLocation = value;
    if (this._pickupLocation) {
      this.dropMarker(this._pickupLocation);
      this.setRoutePolyline();
    }
  }

  get pickupLocation(): LatLngLiteral | null {
    return this._pickupLocation;
  }

  private _destination!: LatLngLiteral | null;
  @Input() set destination(value: LatLngLiteral | null) {
    this._destination = value;
    if (this._destination) {
      this.dropMarker(this._destination);
      this.setRoutePolyline();
    }
  }

  get destination(): LatLngLiteral | null {
    return this._destination;
  }

  ngOnInit() {
    this.options = {
      center: { lat: 45.2396, lng: 19.822 },
      zoom: 13,
    };
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
  }

  dropMarker(coordinates: LatLngLiteral) {
    // this.markers.push({
    //   position: {
    //     lat: coordinates.lat,
    //     lng: coordinates.lng,
    //   },
    //   options: {
    //     animation: google.maps.Animation.DROP,
    //   },
    // })
  }

  setRoutePolyline() {
    if (this.pickupLocation && this.destination) {
      let request = {
        origin: this.pickupLocation,
        destination: this.destination,
        travelMode: google.maps.TravelMode.DRIVING
      };

      this.directionsService.route(request, (response, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setMap(this.map.googleMap ?? null);
          this.directionsRenderer.setDirections(response);
        } else {
          console.log('Something went wrong')
        }
      })
    }
  }
}
