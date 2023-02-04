import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RideDto } from 'src/app/dto/ride-brief';
import { ClientService } from 'src/app/services/client/client.service';

@Component({
  selector: 'app-ride-card',
  templateUrl: './ride-card.component.html',
  styleUrls: ['./ride-card.component.css']
})
export class RideCardComponent {
  @Input() ride!: RideDto;
  @Input() userRole: string = 'ROLE_CLIENT';

  constructor
    (
      private clientService: ClientService,
      private router: Router
    ) { }

  toggleFavorite() {
    this.getRequest()
    .subscribe
    ({
      next: (data) => { console.log(data); window.location.reload(); },
      error: (error) => console.log(error)
    });
  }
  getRequest() {
    if (this.ride.favorite) return this.clientService.removeFromFavorites(this.ride.id);
    else return this.clientService.addToFavorites(this.ride.id);
  }
  redirect() {
    window.open('http://localhost:4200/ride/' + this.ride.id, '_blank');
  }
}
