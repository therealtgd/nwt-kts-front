import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RegistrationConfirmation } from "src/app/dto/registration-confirmation";
import { RideDto } from "src/app/dto/ride-brief";
import { RouteDto } from "src/app/dto/route-dto";
import { post, get, del, put } from "src/app/util/requests";
import { ActiveRide } from "src/app/models/active-ride";
import { ApiResponse } from "src/app/models/api-response";

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

  public getRides(): Observable<ApiResponse<RideDto[]>> {
    return get(this.http, '/client/rides') as Observable<ApiResponse<RideDto[]>>;
  }

  public getFavorites(): Observable<ApiResponse<RouteDto[]>> {
    return get(this.http, '/client/favorite-routes') as Observable<ApiResponse<RouteDto[]>>;
  }

  public addToFavorites(rideId: number): Observable<ApiResponse<RouteDto[]>> {
    return put(this.http, '/client/set-favorite/' + rideId, {}) as Observable<ApiResponse<RouteDto[]>>;
  }

  public removeFromFavorites(rideId: number): Observable<ApiResponse<RouteDto[]>> {
    return del(this.http, '/client/remove-favorite/' + rideId) as Observable<ApiResponse<RouteDto[]>>;
  }

  public getActiveRide(): Observable<ApiResponse<ActiveRide>> {
    return get(this.http, '/client/active-ride') as Observable<ApiResponse<ActiveRide>>
  }

}