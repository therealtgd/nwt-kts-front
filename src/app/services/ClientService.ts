import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RegistrationRequestDTO } from "../dto/RegistrationRequestDTO";
import { RegistrationConfirmationDTO } from "../dto/RegistrationConfirmationDTO";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) { }

  url = "http://localhost:8080/client";

  public registerClient(data: RegistrationRequestDTO) : Observable<Object> {
    return this.http.post(this.url + '/register', data, { headers: new HttpHeaders().set('Content-Type', 'application/json'), responseType: 'text' });
  }
  public activateClient(tokenRequest: RegistrationConfirmationDTO) : Observable<Object> {
    return this.http.post(this.url + '/register/confirm', tokenRequest, { headers: new HttpHeaders().set('Content-Type', 'application/json'), responseType: 'text' });
  }
}