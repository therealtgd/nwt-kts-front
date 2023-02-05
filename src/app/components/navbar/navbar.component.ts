import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TRISTATECHECKBOX_VALUE_ACCESSOR } from 'primeng/tristatecheckbox';
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
    this.role = ''
    this.items = [...this.getItems()]
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
    this.authService.roleSubject.subscribe({
      next: (response: ContextData | null) => {
        this.role = '';
        this.role = response ? response.role : '';
        this.items = this.getItems()
      },
    })
  }

  getItems(): MenuItem[] {
    return [
      {
        label: "Log in",
        icon: "pi pi-sign-in",
        visible: !this.role,
        command: () => this.router.navigate([`login`]),
        style: { 'margin-left': 'auto' }
      },
      {
        label: "Statistics",
        icon: "pi pi-chart-bar",
        command: () => this.router.navigate([`statistics`]),
        style: { 'margin-left': 'auto' },
        visible: this.role === 'ROLE_ADMIN'
      },
      {
        label: "New Driver",
        icon: "pi pi-user-plus",
        command: () => this.router.navigate([`register/driver`]),
        visible: this.role === 'ROLE_ADMIN'
      },
      {
        label: "Drivers",
        icon: "pi pi-users",
        command: () => this.router.navigate([`drivers`]),
        visible: this.role === 'ROLE_ADMIN'
      },
      {
        label: "Clients",
        icon: "pi pi-users",
        command: () => this.router.navigate([`clients`]),
        visible: this.role === 'ROLE_ADMIN'
      },
      {
        label: "Livechat",
        icon: "pi pi-comments",
        command: () => this.router.navigate([`livechat`]),
        visible: this.role === 'ROLE_ADMIN'
      },
      {
        label: "Profile",
        icon: "pi pi-user",
        command: () => this.router.navigate([`profile`]),
        visible: this.role !== '' && this.role === 'ROLE_ADMIN'
      },
      {
        label: "Profile",
        icon: "pi pi-user",
        command: () => this.router.navigate([`profile`]),
        style: { 'margin-left': 'auto' },
        visible: this.role !== '' && this.role !== 'ROLE_ADMIN'
      },
      {
        label: "Log Out",
        icon: "pi pi-sign-out",
        command: () => this.logOut(),
        visible: this.role !== ''
      },
    ];
  }

  logOut() {
    this.authService.logout();
    window.location.reload();
    window.location.reload();
  }
}
