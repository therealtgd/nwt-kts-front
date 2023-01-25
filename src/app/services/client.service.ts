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

  public activateClient(tokenRequest: RegistrationConfirmationDTO) : Observable<Object> {
    return post(this.http, '/client/register/confirm', tokenRequest);
  }
}