import { Component, Input, OnInit } from '@angular/core';
import { ContextData } from 'src/app/dto/context-data';
import { RideDto } from 'src/app/dto/ride-brief';
import { ApiResponse } from 'src/app/models/api-response';
import { UserDto } from 'src/app/models/user-dto';
import { AdminService } from 'src/app/services/admin/admin.service';
import { ClientService } from 'src/app/services/client/client.service';
import { DriverService } from 'src/app/services/driver/driver.service';

@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.css']
})
export class RideHistoryComponent implements OnInit {
  @Input() user!: ContextData;
  @Input() adminSelectedUser: UserDto | null = null;
  @Input() sortingEnabled: boolean = true;
  @Input() userType = '';

  forAdmin: boolean = false;
  failureModalVisibility: boolean = false;
  modalHeader: string = '';
  modalContent: string = '';
  rides: RideDto[] = [];
  sortingType: string[] = ['route - ↓', 'route - ↑', 'price - ↓', 'price - ↑', 'date departed - ↓', 'date departed - ↑'];
  selectedSort: string = 'route - ↓';

  constructor
    (
      private clientService: ClientService,
      private driverService: DriverService,
      private adminService: AdminService,
    ) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    if (this.adminSelectedUser === null) {
      if (this.user.role === "ROLE_CLIENT") {
        this.clientService.getRides(this.selectedSort.replace(/\s/g, ''))
          .subscribe
          ({
            next: (data: ApiResponse<RideDto[]>) => { if (data.body !== null) this.rides = data.body; },
            error: (error) => this.handleFailure(error.error)
          })
      }
      else if (this.user.role === "ROLE_DRIVER") {
        this.driverService.getRides(this.selectedSort.replace(/\s/g, ''))
          .subscribe
          ({
            next: (data) => { if (data.body !== null) this.rides = data.body },
            error: (error) => this.handleFailure(error.error)
          })
      }
    }
    else {
      this.forAdmin = true;
      console.log(this.adminSelectedUser);

      if (this.userType === "DRIVER") {
        this.adminService.getRidesForDriver(this.adminSelectedUser.id)
          .subscribe
          ({
            next: (data) => { if (data.body !== null) this.rides = data.body },
            error: (error) => this.handleFailure(error.error)
          })
      }
      else {
        this.adminService.getRidesForClient(this.adminSelectedUser.id)
          .subscribe
          ({
            next: (data) => { if (data.body !== null) this.rides = data.body },
            error: (error) => this.handleFailure(error.error)
          })
      }
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
