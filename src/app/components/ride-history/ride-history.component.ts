import { Component, Input, OnInit } from '@angular/core';
import { ContextData } from 'src/app/dto/context-data';
import { Ride } from 'src/app/dto/ride-brief';
import { ApiResponse } from 'src/app/models/api-response';
import { ClientService } from 'src/app/services/client/client.service';
import { DriverService } from 'src/app/services/driver/driver.service';

@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.css']
})
export class RideHistoryComponent implements OnInit {
  @Input() user!: ContextData;
  failureModalVisibility: boolean = false;
  modalHeader: string = '';
  modalContent: string = '';
  rides: Ride[] = []

  constructor
    (
      private clientService: ClientService,
      private driverService: DriverService
    ) { }

  ngOnInit(): void {
    if (this.user.role === "ROLE_CLIENT") {
      this.clientService.getRides()
        .subscribe
        ({
          next: (data) => { if (data.body !== null) this.rides = data.body },
          error: (error) => this.handleFailure(error.error)
        })
    }
    else if (this.user.role === "ROLE_DRIVER") {
      this.driverService.getRides()
        .subscribe
        ({
          next: (data) => { if (data.body !== null) this.rides = data.body },
          error: (error) => this.handleFailure(error.error)
        })
    }
  }
  handleFailure(error: ApiResponse<null>) {
    this.displayFailureModal("Oops!", error.message)
  }
  displayFailureModal(header: string, content: string) {
    this.modalContent = content;
    this.modalHeader = header;
    this.failureModalVisibility = true;
  }
}
