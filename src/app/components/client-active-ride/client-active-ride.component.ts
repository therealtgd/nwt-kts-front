import { Component, Input, OnInit } from '@angular/core';
import { Address as AutocompleteAddress } from 'ngx-google-places-autocomplete/objects/address';
import { ActiveRide } from 'src/app/models/active-ride';
import { Stop } from 'src/app/models/stop';
import { Address } from 'src/app/models/address';
import {ConfirmationService, Message} from 'primeng/api';

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

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    if (this.ride !== undefined) {
      this.stops = this.ride.stops.map((s: Address) => {
        const a = new AutocompleteAddress();
        a.formatted_address = s.address;
        return {address: a};
      })
      if (sessionStorage.getItem('currentEta') && Number(sessionStorage.getItem('currentEta')) <= this.ride.eta) {
        this.currentEta = Number(sessionStorage.getItem('currentEta'));
      } else {
        this.currentEta = this.ride.eta;
      }
    }

    const intervalId = setInterval(() => {
      if (this.currentEta > 0) {
        this.currentEta--;
        sessionStorage.setItem('currentEta', this.currentEta.toString());
      }
      if (this.currentEta === 0) {
        sessionStorage.removeItem('currentEta');
        clearInterval(intervalId);
      }
    }, 1000)
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
