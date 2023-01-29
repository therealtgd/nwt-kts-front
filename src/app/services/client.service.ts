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

  public activateClient(tokenRequest: RegistrationConfirmation) : Observable<ApiResponse<null>> {
    return post(this.http, '/client/register/confirm', tokenRequest) as Observable<ApiResponse<null>>;
  }

  public getCreditsBalance(): Observable<ApiResponse<number>> {
    return get(this.http, '/client/credits') as Observable<ApiResponse<number>>;
  }

}