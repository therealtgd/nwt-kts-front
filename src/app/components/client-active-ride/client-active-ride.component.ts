import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { User } from 'src/app/dto/user-brief';
import { ActiveRide } from 'src/app/models/active-ride';
import { ApiResponse } from 'src/app/models/api-response';
import { RideReview } from 'src/app/models/ride-review';
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
  @Output() onRideChanged = new EventEmitter<null>();
  currentEta: number = 0;
  msgs: Message[] = [];
  client!: User;
  showReviewModal: boolean = true;
  review!: FormGroup;
  private _stompClient!: Stomp.Client;

  constructor(private confirmationService: ConfirmationService, private rideService: RideService, private messageService: MessageService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.review = this.fb.group({
      driverRating: this.fb.control('', [Validators.required]),
      vehicleRating: this.fb.control('', [Validators.required]),
      comment: this.fb.control('')
    });
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
        this.messageService.add({severity:'info', summary:'Ride cancelled', detail: message.body});
        this.onRideChanged.emit();
      });
      this._stompClient.subscribe(`/client/ride-finished/${username}`, (message: { body: string }) => {
        this.messageService.add({severity:'info', summary:'Ride cancelled', detail: message.body});
        this.showReviewModal;
      });
    }
  }

  reviewRide() {
    const review: RideReview = {
      vehicleRating: this.review.get('vehicleRating')?.value,
      driverRating: this.review.get('driverRating')?.value,
      comment: this.review.get('comment')?.value,
    }
    this.rideService.reviewRide(this.ride.id, review).subscribe({
      next: (response: ApiResponse<null>) => {
        if (response.success) {
          this.messageService.add({severity:'info', summary:'Review posted', detail: 'Thank you for leaving a review!'});
          this.onRideChanged.emit();
        } else {
          this.messageService.add({severity:'error', summary:'Failed to post review', detail: response.message});
          this.onRideChanged.emit();
        }
      }
    })
    
  }

}
