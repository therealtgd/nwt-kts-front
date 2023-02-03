import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeIcons } from 'primeng/api';
import * as SockJS from 'sockjs-client';
import { ActiveRide } from 'src/app/models/active-ride';
import { ApiResponse } from 'src/app/models/api-response';
import { Driver } from 'src/app/models/driver';
import { DriverService } from 'src/app/services/driver/driver.service';
import { RideService } from 'src/app/services/ride/ride.service';
import * as Stomp from 'stompjs';

type TimelineItemT = {
  label: string,
  icon: string,
  address: string,
}

@Component({
  selector: 'app-driver-home',
  templateUrl: './driver-home.component.html',
  styleUrls: ['./driver-home.component.css']
})
export class DriverHomeComponent implements OnInit {
  driver!: Driver;
  ride: ActiveRide | null = null;
  showDialog = false;
  showFinishRide = false;
  cancellationReason: string = '';
  showEndRideDialog: boolean = false;
  route: TimelineItemT[] = [];
  private _stompClient!: Stomp.Client;

  constructor(
    private driverService: DriverService,
    private messageService: MessageService,
    private rideService: RideService
  ) { }

  ngOnInit(): void {
    this.initializeWebSocketConnection();
    this.getDriver();
    this.getActiveRide();

  }

  private getDriver() {
    this.driverService.getDriver().subscribe({
      next: (response: ApiResponse<Driver>) => {
        if (response.success && response.body) {
          this.driver = response.body;
        }
      },
      error: (error) => console.error(error),
    });
  }

  private getActiveRide() {
    this.driverService.getActiveRide().subscribe({
      next: (response: ApiResponse<ActiveRide>) => {
        if (response.success && response.body) {
          this.ride = { ...response.body };
          this.setRoute();
        }
      },
      error: (error) => console.error(error),
    });
  }

  private setRoute() {

    if (this.ride) {
      let route = [
        { label: 'Pickup', address: this.ride.startAddress.address, icon: PrimeIcons.HOME }
      ]
      if (this.ride.stops) {
        for (let stop of this.ride.stops) {
          route.push({ label: 'Stop', address: stop.address, icon: PrimeIcons.STOP_CIRCLE })
        }
      }
      route.push(
        { label: 'Destination', address: this.ride.endAddress.address, icon: PrimeIcons.FLAG_FILL }
      )
      this.route = [...route];
    }
  }

  initializeWebSocketConnection() {
    this._stompClient = Stomp.over(new SockJS('http://localhost:8080/socket'));
    this._stompClient.connect({}, () => { this.openGlobalSocket(); });
    this._stompClient.debug = () => { };
  }

  openGlobalSocket() {
    this._stompClient.subscribe(`/driver/ride-assigned/${this.driver.username}`, (message: { body: string }) => {
      const ride: ActiveRide = JSON.parse(message.body);
      this.messageService.add({ severity: 'info', summary: 'Ride assigned', detail: `You have a new ride: ${ride.startAddress.address} -> ${ride.endAddress.address}` });
    });

    this._stompClient.subscribe(`/driver/active-ride/${this.driver.username}`, (message: { body: string }) => {
      const ride: ActiveRide = JSON.parse(message.body);
      this.ride = { ...ride };
      this.messageService.add({ severity: 'info', summary: 'Pickup', detail: `Pickup next client at: ${ride.startAddress.address} -> ${ride.endAddress.address}` });
    });

    this._stompClient.subscribe(`/driver/arrived-to-client/${this.driver.username}`, (message: { body: string }) => {
      this.showDialog = true;
    });

    this._stompClient.subscribe(`/driver/arrived-to-destination/${this.driver.username}`, (message: { body: string }) => {
      this.showFinishRide = true;
      this.messageService.add({ severity: 'info', summary: 'Arrived', detail: message.body });
    });

    this._stompClient.subscribe(`/driver/reserved/${this.driver.username}`, (message: { body: string }) => {
      this.messageService.add({ severity: 'info', summary: 'Reserved', detail: message.body });
    });
  }

  startRide() {
    if (this.ride) {
      this.rideService.startRide(this.ride.id).subscribe({
        next: (response: ApiResponse<number>) => {
          if (response.success && response.body) {
            if (this.ride) {
              this.ride.startTime = response.body;
            }
          }
        },
        error: (error) => console.error(error)
      })
    }
  }

  endRide() {
    if (this.ride) {
      this.rideService.endRide(this.ride.id, this.cancellationReason).subscribe({
        next: (response: ApiResponse<number>) => {
          if (response.success && response.body) {
            if (this.ride) {
              this.ride = null;
              this.showEndRideDialog = false;
              this.showDialog = false;
              this.getActiveRide();
            }
          }
        }
      })
    }
  }

  finishRide() {
    if (this.ride) {
      this.rideService.finishRide(this.ride.id).subscribe({
        next: (response: ApiResponse<number>) => {
          if (response.success && response.body) {
            if (this.ride) {
              this.ride.endTime = response.body;
            }
            this.showDialog = false;
            this.showFinishRide = false;
          }
        }
      })
    }
  }

}
