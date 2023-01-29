import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { LatLngLiteral } from 'ngx-google-places-autocomplete/objects/latLng';
import { RideInfo } from 'src/app/models/ride-info';
import { Stop } from 'src/app/models/stop';
import { VehicleType } from 'src/app/models/vehicle-type';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements OnInit {

  @Input() pickupLocation: LatLngLiteral | null = null;
  @Input() destination: LatLngLiteral | null = null;
  @Input() stops: Stop[] = [];
  @Output() onRideInfoChanged = new EventEmitter<any>();
  @ViewChild(GoogleMap) map!: GoogleMap;
  options!: google.maps.MapOptions;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;

  markers: any[] = [];

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
              address: legs[legs.length-1].end_address,
              coordinates: {
                lat: legs[legs.length-1].start_location.lat(),
                lng: legs[legs.length-1].start_location.lng()
              }
            };
            const distance = legs.map(leg => leg.distance!.value).reduce((acc, current) => acc + current, 0);
            const duration = legs.map(leg => leg.duration!.value).reduce((acc, current) => acc + current, 0);

            this.onRideInfoChanged.emit({
              distance: {text: (distance/1000).toFixed(1)+' km', value: distance},
              duration: {text: Math.round(duration/60)+' mins', value: duration},
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
