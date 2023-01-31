import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getWithParams, post } from 'src/app/util/requests';
import { Observable } from 'rxjs';
import { RideInfo } from 'src/app/models/ride-info';
import { ApiResponse } from 'src/app/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  constructor(private http: HttpClient) { }

  public getRidePrice(vehicleType: string, distance: number): Observable<ApiResponse<number>> {
    let params = new HttpParams()
      .set('vehicleType', vehicleType)
      .set('distance', distance.toString());

    return getWithParams(this.http, '/ride/price', params) as Observable<ApiResponse<number>>;
  }

  public getDriver(rideInfo: RideInfo): Observable<ApiResponse<any>> {
    // TODO: get driver from BE
    const params = new HttpParams()
      .set('vehicleType', rideInfo.vehicleType)
      .set('petsAllowed', rideInfo.petsAllowed)
      .set('babiesAllowed', rideInfo.babiesAllowed)
      .set('lat', rideInfo.startAddress.coordinates.lat)
      .set('lng', rideInfo.startAddress.coordinates.lng);

    return getWithParams(this.http, '/ride/nearest-free-driver', params) as Observable<ApiResponse<any>>;
  }

  public orderRide(rideInfo: RideInfo) {
    return post(this.http, '/ride/order', rideInfo);
  }

}
