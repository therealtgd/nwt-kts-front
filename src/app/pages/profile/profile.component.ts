import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContextData } from 'src/app/dto/context-data';
import { getSession } from 'src/app/util/context';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!: ContextData;
  image!: SafeResourceUrl;
  selectedItem: string = 'Edit profile'

  constructor(private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.user = getSession() || { id:'', image:'', displayName:'', username:'', email:'', role:'' };
    this.image = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.user.image);
  }

}
