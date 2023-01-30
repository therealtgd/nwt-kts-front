import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { RideInfo } from '../models/ride-info';
import { getWithParams } from '../util/requests';

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

  public getDriver(rideInfo: RideInfo): Promise<boolean> {
    // TODO: get driver from BE
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 0);
    });
  }

}
