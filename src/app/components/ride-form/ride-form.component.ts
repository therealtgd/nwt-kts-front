import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { LatLngLiteral } from 'ngx-google-places-autocomplete/objects/latLng';



@Component({
  selector: 'app-ride-form',
  templateUrl: './ride-form.component.html',
  styleUrls: ['./ride-form.component.css']
})
export class RideFormComponent {
  pickupLocation: LatLngLiteral | null = null;
  destination: LatLngLiteral | null = null;

  handleAddressChange(address: Address, input: string) {
    const coordinates = address.geometry.location.toJSON();
    if (input === 'pickupLocation') {
      this.pickupLocation = coordinates;
      console.log(this.pickupLocation)
    } else {
      this.destination = coordinates;
    }
  }
}
