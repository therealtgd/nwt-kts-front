import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { LatLngLiteral } from 'ngx-google-places-autocomplete/objects/latLng';
import { of, catchError, tap, Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';
import { RideInfo } from 'src/app/models/ride-info';
import { VehicleType } from 'src/app/models/vehicle-type';
import { ClientService } from 'src/app/services/client.service';
import { RideService } from 'src/app/services/ride.service';


@Component({
  selector: 'app-ride-form',
  templateUrl: './ride-form.component.html',
  styleUrls: ['./ride-form.component.css'],
})
export class RideFormComponent implements OnInit {
  @Input() width!: string;

  pickupLocation: LatLngLiteral | null = null;
  destination: LatLngLiteral | null = null;
  rideInfo!: RideInfo;
  MAX_STOPS = 3;
  startIndex: number = 0;

  modalHeader: string = 'Checkout';
  modalContent: string = 'Pay...';
  modalVisible: boolean = false;
  showSpinner: boolean = true;
  clientCreditsBalance: number = 0;

  autocompleteOptions: any = {
    bounds: new google.maps.LatLngBounds(
      new google.maps.LatLng(45.22467468063447, 19.764811577102698),
      new google.maps.LatLng(45.30961, 19.92136674695161)
    ),
    componentRestrictions: { country: 'RS' }
  }


  constructor(
    private rideService: RideService,
    private clientService: ClientService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.rideInfo = {
      distance: { text: "", value: 0 },
      duration: { text: "", value: 0 },
      startAddress: { address: "", coordinates: { lat: 0, lng: 0 } },
      endAddress: { address: "", coordinates: { lat: 0, lng: 0 } },
      vehicleType: VehicleType.SEDAN,
      driver: null,
      stops: [],
      price: 0,
    };
  }

  handleAddressChange(address: Address, input: string): void {
    const coordinates = address.geometry.location.toJSON();
    if (input === 'pickupLocation') {
      this.pickupLocation = coordinates;
    } else {
      this.destination = coordinates;
    }
  }

  handleRideInfoChanged(rideInfo: any): void | Observable<any> {
    this.rideInfo = { ...this.rideInfo, ...rideInfo }
    this.rideService.getRidePrice(this.rideInfo.vehicleType, this.rideInfo.distance.value)
      .pipe(
        tap((response) => {
          this.rideInfo.price = response as number;
          this.changeDetector.detectChanges();
        }),
        catchError((error) => {
          return of(error);
        })
      ).subscribe();
  }

  handleStopChange(address: Address, i: number): void {
    if (this.rideInfo) {
      const newStops = this.rideInfo?.stops ? [...this.rideInfo.stops] : [];
      newStops[i].address = address;
      this.rideInfo.stops = newStops;
    }
  }

  addStop(): void {
    if (this.rideInfo.stops.length < this.MAX_STOPS) {
      this.rideInfo.stops = [...this.rideInfo.stops, {address: new Address()}];
    }
  }

  removeStop(index: number): void {
    this.rideInfo.stops = this.rideInfo.stops.filter((_, i) => i !== index);
  }

  onDragStart(index: number): void {
    this.startIndex = index;
  }

  onDrop(dropIndex: number): void {
    const stop = this.rideInfo.stops[this.startIndex];
    this.rideInfo.stops.splice(this.startIndex, 1);       // delete from old position
    this.rideInfo.stops.splice(dropIndex, 0, stop);    // add to new position
    this.rideInfo.stops = [...this.rideInfo.stops]
  }

  onRequestRide(): void {
    this.clientService.getCreditsBalance().subscribe({
      next: (data: ApiResponse<number>) => { this.clientCreditsBalance = data.body ?? 0 },
      error: (error) => console.error(error),
    });
    this.modalContent = this.rideInfo.price < this.clientCreditsBalance ? 'It seems like you don\'t have enough credits.' : '';
    this.modalHeader = 'Finding a driver'
    this.modalVisible = true;
    this.rideService.getDriver(this.rideInfo).then((value) => {
      this.showSpinner = !value
      this.modalHeader = 'Checkout'
      this.rideInfo.driver = 'Marko';
    });
  }

  closeModal(): void {
    this.modalVisible = false;
  }

}
