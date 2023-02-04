import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/models/user-dto';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-all-drivers',
  templateUrl: './all-drivers.component.html',
  styleUrls: ['./all-drivers.component.css']
})
export class AllDriversComponent implements OnInit {
  constructor(
    private adminService: AdminService,
  ) { }

  selectedDriver: UserDto | null = null;
  drivers!: UserDto[];

  ngOnInit(): void {
    this.adminService.getAllDrivers()
      .subscribe({
        next: (response) => {
          if (response.body !== null) {
            this.drivers = response.body;
          }
        },
        error: (error) => console.error(error.error),
      });
  }

  handleSelectedUser(event: UserDto | null) {
    this.selectedDriver = null;
    setTimeout(() => {
      this.selectedDriver = event;
    }, 10);
  }

}
