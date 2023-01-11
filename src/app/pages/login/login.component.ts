import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  filteredCountries: any[] = [];

  search($event: any) {
  throw new Error('Method not implemented.');
  }
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  name: string = "";
  surname: string = "";
  city: string = "";
  phone: string = "";

  

  cities: string[] = [
    'Beograd','Bor','Valjevo','Vranje','Vršac','Zaječar','Zrenjanin','Jagodina','Kikinda','Kragujevac',
    'Kraljevo','Kruševac','Leskovac','Loznica','Niš','Novi Pazar','Novi Sad','Pančevo','Pirot','Požarevac',
    'Priština','Prokuplje','Smederevo','Sombor','Sremska Mitrovica','Subotica','Užice','Čačak'
  ]

  filterCountry(event: any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.cities.length; i++) {
      let country = this.cities[i];
      if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.filteredCountries = filtered;
  }

}
