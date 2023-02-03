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
    ) { }

  role: String = '';
  items: MenuItem[] = [];

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
    // only the first item has to have style: {'margin-left': 'auto'}
    this.items = [
      {
        label: "Log in",
        icon: "pi pi-sign-in",
        visible: this.role === '',
        command: (event) => this.router.navigate([`login`]),
        style: { 'margin-left': 'auto' }
      },
      {
        label: "Statistics",
        icon: "pi pi-chart-bar",
        command: (event) => this.router.navigate([`statistics`]),
        style: { 'margin-left': 'auto' },
        visible: this.role === 'ROLE_ADMIN'
      },
      {
        label: "New Driver",
        icon: "pi pi-user-plus",
        command: (event) => this.router.navigate([`register/driver`]),
        visible: this.role === 'ROLE_ADMIN'
      },
      {
        label: "Drivers",
        icon: "pi pi-users",
        command: (event) => this.router.navigate([`drivers`]),
        visible: this.role === 'ROLE_ADMIN'
      },
      {
        label: "Clients",
        icon: "pi pi-users",
        command: (event) => this.router.navigate([`clients`]),
        visible: this.role === 'ROLE_ADMIN'
      },
      {
        label: "Livechat",
        icon: "pi pi-comments",
        command: (event) => this.router.navigate([`livechat`]),
        visible: this.role === 'ROLE_ADMIN'
      },
      {
        label: "Profile",
        icon: "pi pi-user",
        command: (event) => this.router.navigate([`profile`]),
        visible: this.role !== '' && this.role === 'ROLE_ADMIN'
      },
      {
        label: "Profile",
        icon: "pi pi-user",
        command: (event) => this.router.navigate([`profile`]),
        style: { 'margin-left': 'auto' },
        visible: this.role !== '' && this.role !== 'ROLE_ADMIN'
      },
      {
        label: "Log Out",
        icon: "pi pi-sign-out",
        command: (event) => this.logOut(),
        visible: this.role !== ''
      },
    ];
  }
  logOut() {
    this.authService.logout();
    window.location.reload();
  }
}
