import { Component, Input } from '@angular/core';
import { AddressDto } from 'src/app/dto/address-dto';

@Component({
  selector: 'app-detailed-route',
  templateUrl: './detailed-route.component.html',
  styleUrls: ['./detailed-route.component.css']
})
export class DetailedRouteComponent {
  @Input("stops") stops: AddressDto[] = [];
  @Input("startTime") startTime: string = '';
  @Input("endTime") endTime: string = '';
}
