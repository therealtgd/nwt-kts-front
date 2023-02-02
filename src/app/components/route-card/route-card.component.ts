import { Component, Input } from '@angular/core';
import { RouteDto } from 'src/app/dto/route-dto';
import { ClientService } from 'src/app/services/client/client.service';

@Component({
  selector: 'app-route-card',
  templateUrl: './route-card.component.html',
  styleUrls: ['./route-card.component.css']
})
export class RouteCardComponent {
  @Input() route!: RouteDto;
  
  constructor
    (
      private clientService: ClientService
    ) { }
  
    removeFavorite() {
      this.clientService.removeFromFavorites(this.route.id)
      .subscribe
      ({
        next: (data) => { console.log(data); window.location.reload(); },
        error: (error) => console.log(error)
      });
    }
}
