import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { User } from 'src/app/dto/user-brief';
import { ActiveRide } from 'src/app/models/active-ride';
import { RideService } from 'src/app/services/ride/ride.service';
import { getSession } from 'src/app/util/context';
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-client-active-ride',
  templateUrl: './client-active-ride.component.html',
  styleUrls: ['./client-active-ride.component.css']
})
export class ClientActiveRideComponent implements OnInit {

  @Input() ride!: ActiveRide;
  @Output() onRideCancelled = new EventEmitter<null>();
  currentEta: number = 0;
  msgs: Message[] = [];
  client!: User;
  private _stompClient!: Stomp.Client;

  constructor(private confirmationService: ConfirmationService, private rideService: RideService, private messageService: MessageService) {}

  ngOnInit(): void {
    getSession() && this.initializeWebSocketConnection();

    const intervalId = setInterval(async () => {
        const response = await firstValueFrom(this.rideService.getDriverEta())
        if (response.success && response.body) {
          this.ride = {...this.ride, eta: response.body}
          console.log(this.ride, this.ride.eta)
          if (response.body <= 0) {
            clearInterval(intervalId)
            this.messageService.add({severity:'info', summary:'Driver arrived', detail:`Your driver is at the pickup location: ${this.ride.startAddress.address}`});
          }
        } else {
          console.error(response.message);
        }
      }, 15 * 1000)
  }

  reportDriver() {
    this.confirmationService.confirm({
        message: 'Report driver for diverging from the initial route?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.msgs = [{severity:'info', summary:'Confirmed', detail:'Driver reported'}];
        },
    });
  }

  initializeWebSocketConnection() {
    this._stompClient = Stomp.over(new SockJS('http://localhost:8080/socket'));
    this._stompClient.connect({}, () => { this.openGlobalSocket(); });
    this._stompClient.debug = () => { };
  }

  openGlobalSocket() {
    const username = getSession()?.username;
    console.log(`Username: ${username}`)
    if (username) {
      this._stompClient.subscribe(`/client/ride-cancelled/${username}`, (message: { body: string }) => {
        console.log("Ride cancelled")
        this.messageService.add({severity:'info', summary:'Ride cancelled', detail: message.body});
        this.onRideCancelled.emit();
      });
      // TODO: Add driver arrived notification
    }
  }

}
