import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RideDto } from 'src/app/dto/ride-brief';
import { ApiResponse } from 'src/app/models/api-response';
import { Driver } from 'src/app/models/driver';
import { DriverStatus } from 'src/app/models/driver-status';
import { get, getWithParams, put } from 'src/app/util/requests';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  
  constructor(private http: HttpClient) { }

  public getRides() : Observable<ApiResponse<RideDto[]>> {
    return get(this.http, '/driver/rides') as Observable<ApiResponse<RideDto[]>>;
  }
  
  public getAllActiveDrivers(): Observable<Object> {
    return get(this.http, '/driver/get-all-active');
  }

  getAllAvailableDrivers(): Observable<ApiResponse<Driver[]>> {
    const params = new HttpParams().set('status', DriverStatus.AVAILABLE);
    return getWithParams(this.http, '/driver/get-all-by-status', params) as Observable<ApiResponse<Driver[]>>;
  }
  
  getAllBusyDrivers(): Observable<ApiResponse<Driver[]>> {
    const params = new HttpParams().set('status', DriverStatus.BUSY);
    return getWithParams(this.http, '/driver/get-all-by-status', params) as Observable<ApiResponse<Driver[]>>;
  }
  
  public unassignDriver(driverId: number): Observable<ApiResponse<null>> {
    return put(this.http, '/driver/unassign', driverId) as Observable<ApiResponse<null>>;
  }

  getDriver(): Observable<ApiResponse<Driver>> {
    return get(this.http, '/driver') as Observable<ApiResponse<Driver>>;
  }

}
