import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ContextData } from 'src/app/dto/context-data';
import { AuthService } from 'src/app/services/auth/auth.service';
import { getSession } from 'src/app/util/context';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor 
  (
    private authService: AuthService
  ) {}

  role: String = '';

  ngOnInit() {

    const session: ContextData | undefined = getSession(); 
    if (session !== undefined) {
      this.role = session.role;
    }
    else {
      this.role = '';
    }

  }

  logOut() {
    this.authService.logout();
    window.location.reload();
  }
}
