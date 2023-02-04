import { Component, Input } from '@angular/core';
import { User } from 'src/app/dto/user-brief';

@Component({
  selector: 'app-detailed-participants',
  templateUrl: './detailed-participants.component.html',
  styleUrls: ['./detailed-participants.component.css']
})
export class DetailedParticipantsComponent {
  @Input("clients") clients: User[] = [];
  @Input("driver") driver!: User;
}
