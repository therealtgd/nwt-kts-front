import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { RegistrationConfirmation } from "../dto/registration-confirmation";
import { ApiResponse } from "../models/api-response";
import { get, post } from "../util/requests";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) { }

  public activateClient(tokenRequest: RegistrationConfirmation) : Observable<Object> {
    return post(this.http, '/client/register/confirm', tokenRequest);
  }

  public getCreditsBalance(): Observable<ApiResponse<number>> {
    return get(this.http, '/client/credits') as Observable<ApiResponse<number>>;
  }

}