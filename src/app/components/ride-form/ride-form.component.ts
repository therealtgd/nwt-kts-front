import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { LatLngLiteral } from 'ngx-google-places-autocomplete/objects/latLng';
import { of, catchError, tap } from 'rxjs';
import { RideInfo } from 'src/app/models/ride-info';
import { Stop } from 'src/app/models/stop';
import { VehicleType } from 'src/app/models/vehicle-type';
import { RideService } from 'src/app/services/ride.service';


@Component({
  selector: 'app-ride-form',
  templateUrl: './ride-form.component.html',
  styleUrls: ['./ride-form.component.css'],
})
export class RideFormComponent {
  @Input() width! : string;
  pickupLocation: LatLngLiteral | null = null;
  destination: LatLngLiteral | null = null;
  distance: string = '';
  price: number = 0;
  vehicleType = VehicleType.SEDAN;
  stops: Stop[] = [];
  MAX_STOPS = 3;
  startIndex: number = 0;
  autocompleteOptions: any = {
    bounds: new google.maps.LatLngBounds(
      new google.maps.LatLng(45.22467468063447, 19.764811577102698),
      new google.maps.LatLng(45.30961, 19.92136674695161)
    ),
    componentRestrictions: { country: 'RS' }
  }


  constructor(private rideService: RideService, private changeDetector: ChangeDetectorRef) {}

  handleAddressChange(address: Address, input: string) {
    const coordinates = address.geometry.location.toJSON();
    if (input === 'pickupLocation') {
      this.pickupLocation = coordinates;
    } else {
      this.destination = coordinates;
    }
  }

  handleRideInfoChanged(rideInfo: RideInfo) {
    this.distance = rideInfo.distance.text;
    this.rideService.getRidePrice(this.vehicleType, rideInfo.distance.value)
    .pipe(
      tap((response) => {
        this.price = response as number;
        this.changeDetector.detectChanges();
      }),
      catchError((error) => {
        return of(error);
      })
    ).subscribe();
  }

  handleStopChange(address: Address, i: number) {
    const newStops = [...this.stops];
    newStops[i].address = address;
    this.stops = newStops;
  }

  addStop() {
    if (this.stops.length < this.MAX_STOPS) {
      this.stops.push({address: new Address()});
    }
  }

  removeStop(index: number) {
    console.log(index);
    this.stops = this.stops.filter((_, i) => i !== index);
  }

  onDragStart(index: number) {
    this.startIndex = index;
  }

onDrop(dropIndex: number) {
    const stop = this.stops[this.startIndex];
    this.stops.splice(this.startIndex, 1);       // delete from old position
    this.stops.splice(dropIndex, 0, stop);    // add to new position
    this.stops = [...this.stops]
}

}
