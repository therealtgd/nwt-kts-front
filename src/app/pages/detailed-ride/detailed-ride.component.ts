import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RideDetailed } from 'src/app/dto/ride-detailed';
import { ApiResponse } from 'src/app/models/api-response';
import { RideService } from 'src/app/services/ride/ride.service';

@Component({
  selector: 'app-detailed-ride',
  templateUrl: './detailed-ride.component.html',
  styleUrls: ['./detailed-ride.component.css']
})
export class DetailedRideComponent implements OnInit {
  failureModalVisibility: boolean = false;
  modalContent: string = '';
  modalHeader: string = '';
  ride!: RideDetailed;

  constructor
    (
      private route: ActivatedRoute,
      private router: Router,
      private rideService: RideService
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params =>
      this.rideService.getRide(params['id'])
        .subscribe({
          next: (response: ApiResponse<RideDetailed>) => {this.ride = (response.body as RideDetailed); console.log(this.ride); },
          error: (error) =>  this.handleError(error.error)
        }));
        
  }
  handleError(error: ApiResponse<null>) {
    this.displayFailureModal("Oops!", error.message);
  }
  displayFailureModal(header: string, content: Object) {
    this.modalContent = content.toString();
    this.modalHeader = header;
    this.failureModalVisibility = true;
  }
  redirect(pageName: string = '') {
    this.router.navigate([`${pageName}`]);
  }
}
