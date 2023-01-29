import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getWithParams } from '../util/requests';
import { Observable } from 'rxjs';
import { VehicleType } from '../models/vehicle-type';
import { RideInfo } from '../models/ride-info';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  constructor(private http: HttpClient) { }

  public getRidePrice(vehicleType: string, distance: number) : Observable<Object> {
    let params = new HttpParams()
      .set('vehicleType', vehicleType)
      .set('distance', distance.toString());

    return getWithParams(this.http, '/ride/price', params);
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
