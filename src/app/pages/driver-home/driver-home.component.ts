import { Component, OnInit } from '@angular/core';
import { ActiveRide } from 'src/app/models/active-ride';
import { Address } from 'src/app/models/address';
import { ApiResponse } from 'src/app/models/api-response';
import { Driver } from 'src/app/models/driver';
import { Stop } from 'src/app/models/stop';
import { DriverService } from 'src/app/services/driver/driver.service';
import { Address as AutocompleteAddress } from 'ngx-google-places-autocomplete/objects/address';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-driver-home',
  templateUrl: './driver-home.component.html',
  styleUrls: ['./driver-home.component.css']
})
export class DriverHomeComponent implements OnInit {

  driver!: Driver;
  ride: ActiveRide | null = null;
  stops: Stop[] | null = null;
  private _stompClient!: Stomp.Client;

  constructor(private driverService: DriverService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.initializeWebSocketConnection();
    this.driverService.getDriver().subscribe({
      next: (response: ApiResponse<Driver>) => {
        if (response.success && response.body) {
          this.driver = response.body;
        }
      },
      error: (error) => console.error(error),
    })
    this.driverService.getActiveRide().subscribe({
      next: (response: ApiResponse<ActiveRide>) => {
        if (response.success && response.body) {
          this.ride = response.body;
          this.stops =  this.ride.stops.map((s: Address) => {
            const a = new AutocompleteAddress();
            a.formatted_address = s.address;
            return {address: a};
          })
          console.log(this.ride)
        }
      },
      error: (error) => console.error(error),
    })
  }

  initializeWebSocketConnection() {
    this._stompClient = Stomp.over(new SockJS('http://localhost:8080/socket'));
    this._stompClient.connect({}, () => { this.openGlobalSocket(); });
    this._stompClient.debug = () => { };
  }

  openGlobalSocket() {
    this._stompClient.subscribe('/driver/ride-assigned', (message: { body: string }) => {
      const ride: ActiveRide = JSON.parse(message.body);
      this.messageService.add({severity:'info', summary:'Ride assigned', detail:`You have a new ride: ${ride.startAddress.address} -> ${ride.endAddress.address}`});
    });
  }

}
