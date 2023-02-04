import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/models/user-dto';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-all-clients',
  templateUrl: './all-clients.component.html',
  styleUrls: ['./all-clients.component.css']
})
export class AllClientsComponent implements OnInit {
  constructor(
    private adminService: AdminService,
  ) { }

  selectedClient: UserDto | null = null;
  clients!: UserDto[];

  ngOnInit(): void {
    this.adminService.getAllClients()
      .subscribe({
        next: (response) => {
          if (response.body !== null) {
            this.clients = response.body;
          }
        },
        error: (error) => console.error(error.error),
      });
  }

  handleSelectedUser(event: UserDto | null) {
    this.selectedClient = null;
    setTimeout(() => {
      this.selectedClient = event;
    }, 10);
  }

}
