import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RegistrationConfirmation } from "../dto/registration-confirmation";
import { post } from "../util/requests";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) { }

  public activateClient(tokenRequest: RegistrationConfirmation) : Observable<Object> {
    return post(this.http, '/client/register/confirm', tokenRequest);
  }
}