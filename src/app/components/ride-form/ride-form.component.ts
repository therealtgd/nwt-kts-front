import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { LatLngLiteral } from 'ngx-google-places-autocomplete/objects/latLng';
import { of, catchError, tap, Observable, firstValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';
import { DriverStatus } from 'src/app/models/driver/driver-status';
import { RideInfo } from 'src/app/models/ride-info';
import { VehicleType } from 'src/app/models/vehicle-type';
import { ClientService } from 'src/app/services/client/client.service';
import { RideService } from 'src/app/services/ride/ride.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { getSession } from 'src/app/util/context';


@Component({
  selector: 'app-ride-form',
  templateUrl: './ride-form.component.html',
  styleUrls: ['./ride-form.component.css'],
})
export class RideFormComponent implements OnInit {
  @Input() width!: string;

  vehicleTypes: VehicleType[] = [];
  pickupLocation: LatLngLiteral | null = null;
  destination: LatLngLiteral | null = null;
  rideInfo!: RideInfo;
  MAX_STOPS = 3;
  startIndex: number = 0;

  modalHeader: string = '';
  modalContent: string = '';
  modalVisible: boolean = false;
  showSpinner: boolean = false;
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
    private vehicleService: VehicleService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.vehicleService.getAllVehicleTypes().subscribe({
      next: (response: ApiResponse<VehicleType[]>) => {
        if (response.success && response.body) {
          this.vehicleTypes = response.body;
        } else {
          console.error('Error while getting vehicle types')
        }
      },
      error: (error) => console.error(error),  
    });

    this.rideInfo = {
      distance: 0,
      duration: 0,
      startAddress: { address: "", coordinates: { lat: 0, lng: 0 } },
      endAddress: { address: "", coordinates: { lat: 0, lng: 0 } },
      vehicleType: VehicleType.SEDAN,
      driver: null,
      stops: [],
      price: 0,
      petsAllowed: false,
      babiesAllowed: false,
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

  handleRideInfoChanged(rideInfo: any): void {
    this.rideInfo = { ...this.rideInfo, ...rideInfo }
    if (this.rideInfo.startAddress.address && this.rideInfo.endAddress.address) {
      this.rideService.getRidePrice(this.rideInfo.vehicleType, this.rideInfo.distance).subscribe({
        next: (response: ApiResponse<number>) => {
          if (response.success && response.body !== null) {
            this.rideInfo.price = response.body;
            this.changeDetector.detectChanges();
          } else {
            console.error(response.message);
          }
        },
        error: (error) => console.error(error),
      })
    }
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
      this.rideInfo.stops = [...this.rideInfo.stops, { address: new Address() }];
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
    this.rideInfo.stops.splice(this.startIndex, 1);
    this.rideInfo.stops.splice(dropIndex, 0, stop);
    this.rideInfo.stops = [...this.rideInfo.stops]
  }

  async onRequestRide(): Promise<void> {
    await this.getCreditsBalance()
    if (this.clientCreditsBalance < this.rideInfo.price) {
      this.modalContent = 'It seems like you don\'t have enough credits.';
      this.modalHeader = 'Not enough credits';
      this.modalVisible = true;
    } else {
      this.modalContent = '';
      this.modalHeader = 'Finding a driver';
      this.showSpinner = true;
      this.modalVisible = true;
      this.getDriver();
    }
  }

  async getCreditsBalance() {
    try {
      const response = await firstValueFrom(this.clientService.getCreditsBalance());
      if (response.success && response.body) {
        this.clientCreditsBalance = response.body as number;
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  getDriver(): void {
    
    this.rideService.getDriver(this.rideInfo).subscribe(
      {
        next: (response: ApiResponse<any>) => {
          if (!response.success) {
            console.error(response.message);
          } else {
            if (response.body === null) {
              this.modalHeader = 'All drivers are busy';
              this.modalContent = 'All drivers are busy, try again later.'
            }
            this.rideInfo.driver = response.body;
            if (this.rideInfo.driver?.status === DriverStatus.BUSY) {
              this.modalHeader = 'All drivers are busy'
              this.modalContent = 'We assigned a driver nearest to the end of his/hers ride to you.\nPlease wait.'
            } else {
              this.modalHeader = 'Checkout'
            }
            this.showSpinner = false;
          }
        },
        error: (error) => console.error(error),
      }
    )
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  orderRide(): void {
    if (getSession()?.username) {
      this.rideInfo.clients = [getSession()!.username]
      console.log(this.rideInfo);
      this.rideService.orderRide(this.rideInfo).subscribe(
        {
          next: () => {
            this.modalVisible = false;
          },
          error: (error: any) => console.error(error),
        }
      )
    }
  }

}
