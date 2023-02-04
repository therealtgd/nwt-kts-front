import { Component, Input } from '@angular/core';
import { ReviewDto } from 'src/app/dto/review-dto';

@Component({
  selector: 'app-detailed-reviews',
  templateUrl: './detailed-reviews.component.html',
  styleUrls: ['./detailed-reviews.component.css']
})
export class DetailedReviewsComponent {
  @Input("reviews") reviews: ReviewDto[] = [];
  @Input("driverRating") driverRating: number = 0;
  @Input("vehicleRating") vehicleRating: number = 0;
}
