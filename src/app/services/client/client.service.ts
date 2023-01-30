import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RegistrationConfirmation } from "src/app/dto/registration-confirmation";
import { Ride } from "src/app/dto/ride-brief";
import { ApiResponse } from "src/app/models/api-response";
import { post, get } from "src/app/util/requests";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  public activateClient(tokenRequest: RegistrationConfirmation): Observable<ApiResponse<null>> {
    return post(this.http, '/client/register/confirm', tokenRequest) as Observable<ApiResponse<null>>;
  }

  public getCreditsBalance(): Observable<ApiResponse<number>> {
    return get(this.http, '/client/credits') as Observable<ApiResponse<number>>;
  }
  
  public getRides() : Observable<ApiResponse<Ride[]>> {
    return get(this.http, '/client/rides') as Observable<ApiResponse<Ride[]>>;
  }

}