import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContextData } from 'src/app/dto/context-data';
import { ActiveRide } from 'src/app/models/active-ride';
import { ApiResponse } from 'src/app/models/api-response';
import { ClientService } from 'src/app/services/client/client.service';
import { getSession } from 'src/app/util/context';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: ContextData | null = null;
  activeRide: ActiveRide | null = null;

  constructor(private clientService: ClientService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.user = getSession() ?? null;
    this.getClientActiveRide();
  }

  private getClientActiveRide() {
    if (this.user && this.user.role === 'ROLE_CLIENT') {
      this.clientService.getActiveRide().subscribe({
        next: (response: ApiResponse<ActiveRide>) => {
          if (response.success && response.body) {
            this.activeRide = { ...response.body };
          }
        },
        error: (error) => console.error(error),
      });
    }
  }

  handleClientActiveRideChanged(value: ActiveRide) {
    this.activeRide = { ...value };
    this.changeDetector.detectChanges();
  }

  handleRideChanged(ride: ActiveRide | null) {
    this.activeRide = ride;
    this.getClientActiveRide();
  }

}
