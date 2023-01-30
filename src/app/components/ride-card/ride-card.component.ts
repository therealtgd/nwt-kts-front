import { Component, Input } from '@angular/core';
import { Ride } from 'src/app/dto/ride-brief';

@Component({
  selector: 'app-ride-card',
  templateUrl: './ride-card.component.html',
  styleUrls: ['./ride-card.component.css']
})
export class RideCardComponent {
  @Input() ride!: Ride;

}
