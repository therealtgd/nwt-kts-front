import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent {

  constructor
    (
      private router: Router
    ) { }

  items: any = [
    {
      name: "Statistics",
      icon: "pi-chart-bar",
      description: "Checkout daily number of rides, distance travelled and total income",
      route: "/statistics"
    },
    {
      name: "Add New Driver",
      icon: "pi-user-plus",
      description: "Expand the Foober family and register a new driver",
      route: "/new-driver"
    },
    {
      name: "View All Drivers",
      icon: "pi-users",
      description: "View your drivers' ride history, block or unblock them",
      route: "/drivers"
    },
    {
      name: "View All Clients",
      icon: "pi-users",
      description: "View your clients' ride history, block or unblock them",
      route: "/clients"
    },
    {
      name: "Livechat",
      icon: "pi-comments",
      description: "Real-time chat to solve all your clients' issues",
      route: "/livechat"
    },
    {
      name: "Your Profile",
      icon: "pi-user-edit",
      description: "Change your personal information including profile picture",
      route: "/profile"
    }
  ];
  navigate(route: string) {
    this.router.navigate([route]);
  }
}
