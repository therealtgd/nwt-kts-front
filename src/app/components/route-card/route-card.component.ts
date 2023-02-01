import { Component, Input } from '@angular/core';
import { RouteDto } from 'src/app/dto/route-dto';

@Component({
  selector: 'app-route-card',
  templateUrl: './route-card.component.html',
  styleUrls: ['./route-card.component.css']
})
export class RouteCardComponent {
  @Input() route!: RouteDto;
  
}
