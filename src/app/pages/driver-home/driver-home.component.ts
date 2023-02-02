import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/api-response';
import { Driver } from 'src/app/models/driver';
import { DriverService } from 'src/app/services/driver/driver.service';

@Component({
  selector: 'app-driver-home',
  templateUrl: './driver-home.component.html',
  styleUrls: ['./driver-home.component.css']
})
export class DriverHomeComponent implements OnInit {

  driver!: Driver;

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.driverService.getDriver().subscribe({
      next: (response: ApiResponse<Driver>) => {
        if (response.success && response.body) {
          this.driver = response.body;
        }
      },
      error: (error) => console.error(error),
    })
  }

}
