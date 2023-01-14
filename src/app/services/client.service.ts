import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RegistrationRequestDTO } from "../dto/RegistrationRequestDTO";
import { RegistrationConfirmationDTO } from "../dto/RegistrationConfirmationDTO";
import { post } from "../util/requests";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) { }

  url = "http://localhost:8080/client";

  public registerClient(data: RegistrationRequestDTO) : Observable<Object> {
    return post(this.http, '/register', data);
  }
  public activateClient(tokenRequest: RegistrationConfirmationDTO) : Observable<Object> {
    return post(this.http, '/register/confirm', tokenRequest);
  }
}