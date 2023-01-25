import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ContextData } from 'src/app/dto/context-data';
import { AuthService } from 'src/app/services/auth/auth.service';
import { getSession, getToken } from 'src/app/util/context';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor 
  (
    private authService: AuthService,
    private router: Router
  ) {}

  role: String = '';

  ngOnInit() {
    if (getToken()) {
      this.authService.getWhoAmI();
      const session: ContextData | undefined = getSession(); 
      if (session !== undefined) {
        this.role = session.role;
      }
      else {
        this.role = '';
      }
    }
  }

  logOut() {
    this.authService.logout();
    window.location.reload();
  }
  logIn() {
    this.router.navigate([`login`]);
  }
}
