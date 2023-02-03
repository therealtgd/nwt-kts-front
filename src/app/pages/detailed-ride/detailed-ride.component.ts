import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RideDetailed } from 'src/app/dto/ride-detailed';
import { ApiResponse } from 'src/app/models/api-response';
import { RideService } from 'src/app/services/ride/ride.service';

@Component({
  selector: 'app-detailed-ride',
  templateUrl: './detailed-ride.component.html',
  styleUrls: ['./detailed-ride.component.css']
})
export class DetailedRideComponent implements OnInit {
  ride!: RideDetailed;

  constructor
    (
      private route: ActivatedRoute,
      private rideService: RideService
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params =>
      this.rideService.getRide(params['id'])
        .subscribe({
          next: (response: ApiResponse<RideDetailed>) => {this.ride = (response.body as RideDetailed); console.log(this.ride); },
          error: (error) => {/* display error */ }
        }));
        
  }
}
