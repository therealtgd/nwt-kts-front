import { Component, Input, OnInit } from '@angular/core';
import { Address as AutocompleteAddress } from 'ngx-google-places-autocomplete/objects/address';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { ActiveRide } from 'src/app/models/active-ride';
import { Address } from 'src/app/models/address';
import { Stop } from 'src/app/models/stop';
import { RideService } from 'src/app/services/ride/ride.service';

@Component({
  selector: 'app-client-active-ride',
  templateUrl: './client-active-ride.component.html',
  styleUrls: ['./client-active-ride.component.css']
})
export class ClientActiveRideComponent implements OnInit {

  @Input() ride!: ActiveRide;
  stops: Stop[] = [];
  currentEta: number = 0;
  msgs: Message[] = [];

  constructor(private confirmationService: ConfirmationService, private rideService: RideService, private messageService: MessageService) {}

  ngOnInit(): void {
    if (this.ride !== undefined) {
      this.stops = this.ride.stops.map((s: Address) => {
        const a = new AutocompleteAddress();
        a.formatted_address = s.address;
        return {address: a};
      })
    }

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

}
