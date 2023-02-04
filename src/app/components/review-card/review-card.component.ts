import { Component, Input } from '@angular/core';
import { ReviewDto } from 'src/app/dto/review-dto';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent {
  @Input("review") review!: ReviewDto;
}
