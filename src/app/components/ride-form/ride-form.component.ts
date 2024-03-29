import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { LatLngLiteral } from 'ngx-google-places-autocomplete/objects/latLng';
import { firstValueFrom } from 'rxjs';
import { ActiveRide } from 'src/app/models/active-ride';
import { ApiResponse } from 'src/app/models/api-response';
import { RideInfo } from 'src/app/models/ride-info';
import { VehicleType } from 'src/app/models/vehicle-type';
import { ClientService } from 'src/app/services/client/client.service';
import { DriverService } from 'src/app/services/driver/driver.service';
import { RideService } from 'src/app/services/ride/ride.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { getSession } from 'src/app/util/context';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-ride-form',
  templateUrl: './ride-form.component.html',
  styleUrls: ['./ride-form.component.css'],
})
export class RideFormComponent implements OnInit {

  @Input() width!: string;
  @Output() onClientActiveRideChanged = new EventEmitter<ActiveRide>();

  userRole: string = '';
  vehicleTypes: VehicleType[] = [];
  pickupLocation: LatLngLiteral | null = null;
  destination: LatLngLiteral | null = null;
  rideInfo!: RideInfo;
  MAX_STOPS = 3;
  startIndex: number = 0;

  splitFareClients: string[] = [];
  usernameAutocompleteResults: string[] = [];

  private _stompClient!: Stomp.Client;


  modalHeader: string = '';
  modalContent: string = '';
  modalVisible: boolean = false;
  showSpinner: boolean = false;
  clientCreditsBalance: number = 0;
  splitFare: boolean = false;

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
    private driverService: DriverService,
    private changeDetector: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit(): void {
    this.initializeWebSocketConnection(); 
    this.userRole = getSession() !== undefined ? getSession()!.role : '';
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

  onSplitFareAdded(client: string) {
    const len = this.splitFareClients.length // old length
    this.splitFareClients = [...this.splitFareClients, client] // add new client
    this.splitFareClients = [...new Set(this.splitFareClients)]; // remove duplicates
    if (this.splitFareClients.length === len) { // if the length stayed the same skip
      return
    }
    // CURRENT_PRICE / (ME + SPLIT_FARE_CLIENTS)
    this.rideInfo.price = this.rideInfo.price / (1 + this.splitFareClients.length)
  }

  onSplitFareRemoved(client: string) {
    const newList = this.splitFareClients.filter(c => c !== client);
    this.splitFareClients = [...newList]
    // CURRENT_PRICE * (ME + REMOVED_CLIENT + NEW_SPLIT_FARE_CLIENTS)
    this.rideInfo.price = this.rideInfo.price * (1 + 1 + this.splitFareClients.length)
  }

  handleAddressChange(address: Address, input: string): void {
    const coordinates = address.geometry.location.toJSON();
    if (input === 'pickupLocation') {
      this.pickupLocation = {...coordinates};
    } else {
      this.destination = {...coordinates};
    }
  }

  handleRideInfoChanged(rideInfo: any): void {
    this.rideInfo = { ...this.rideInfo, ...rideInfo }
    if (this.rideInfo.startAddress.address && this.rideInfo.endAddress.address) {
      this.rideService.getRidePrice(this.rideInfo.vehicleType, this.rideInfo.distance).subscribe({
        next: (response: ApiResponse<number>) => {
          if (response.success && response.body !== null) {
            this.rideInfo.price = response.body / (1 + this.splitFareClients.length);
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
      newStops[i] = {
        address: address.formatted_address,
        coordinates: {
          lat: address.geometry.location.lat(),
          lng: address.geometry.location.lng()
        }
      }
      this.rideInfo.stops = newStops;
    }
  }

  addStop(): void {
    if (this.rideInfo.stops.length < this.MAX_STOPS) {
      this.rideInfo.stops = [...this.rideInfo.stops, { address: '', coordinates: { lat: 0, lng: 0 } }];
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
    if (getSession() === undefined) {
      this.router.navigate(['/login'])
    } else {
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
            if (this.rideInfo.driver?.isReserved) {
              this.modalHeader = 'All drivers are busy'
              this.modalContent = 'A driver nearest to the end of their ride has been reserved for your ride.'
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
    if (this.rideInfo.driver) {
      this.driverService.unassignDriver(this.rideInfo.driver.id).subscribe({
        next: () => this.rideInfo.driver = null,
        error: (error: any) => console.error(error),
      })
    }
    this.modalVisible = false;
  }

  orderRide(): void {
    if (getSession()?.username) {
      this.rideInfo.clients = [getSession()!.username, ...this.splitFareClients]
      this.rideService.orderRide(this.rideInfo).subscribe(
        {
          next: (response: ApiResponse<ActiveRide>) => {
            this.modalVisible = false;
            if (response.success && response.body) {
              this.onClientActiveRideChanged.emit(response.body)
            }
          },
          error: (error: any) => console.error(error),
        }
      )
    }
  }

  search(event: any) {
    this.clientService.getUsernameByQuery(event.query).subscribe({
      next: (response: ApiResponse<string[]>) => {
        if (response.success && response.body) {
          this.usernameAutocompleteResults = [...response.body];
        }
      }
    })
  }

  initializeWebSocketConnection() {
    this._stompClient = Stomp.over(new SockJS('http://localhost:8080/socket'));
    this._stompClient.connect({}, () => { this.openGlobalSocket(); });
    this._stompClient.debug = () => { };
  }

  openGlobalSocket() {
    console.log("OPENING SOCKET")
    const username = getSession()?.username;
    console.log(`Username: ${username}`)
    if (username) {
      console.log("Adding web socket code")
      this._stompClient.subscribe(`/client/split-fare/${username}`, (message: { body: string }) => {
        const splitFareRide: ActiveRide = JSON.parse(message.body);
        
        this.confirmationService.confirm({
          message: 'Do you want to join this ride?',
          header: 'New shared ride request',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.rideService.acceptSplitFare(splitFareRide.id).subscribe({
              next: (response: ApiResponse<null>) => {
                if (response.success) {
                  this.messageService.add({ severity: 'info', summary: 'Payment successfull', detail: `Please wait untill all participants pay.` });
                } else {
                  this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: 'Something went wrong on our end. The ride has been cancelled and your credit has been refunded.' })
                }
              },
            })
          },
          reject: () => {
            console.log("REJECTED")
            this.rideService.declineSplitFare(splitFareRide.id).subscribe({
              next: (response: ApiResponse<null>) => {
                if (response.success) {
                  this.messageService.add({ severity: 'info', summary: 'Request declined', detail: `The ride was cancelled successfully` });
                } else {
                  this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: 'Something went wrong on our end. The ride has been cancelled and your credit has been refunded.' })
                }
              },
            })
          }
        });
      });

      this._stompClient.subscribe(`/client/split-fare-ride-started/${username}`, (message: { body: string }) => {
        const splitFareRide: ActiveRide = JSON.parse(message.body);
        this.onClientActiveRideChanged.emit(splitFareRide);
        this.messageService.add({ severity: 'info', summary: 'Shared ride started', detail: 'Everyone accepted the shared ride. Driver is on route.' });
      });
    }
  }

}
