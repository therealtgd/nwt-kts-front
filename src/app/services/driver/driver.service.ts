import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RideDto } from 'src/app/dto/ride-brief';
import { ActiveRide } from 'src/app/models/active-ride';
import { ApiResponse } from 'src/app/models/api-response';
import { Driver } from 'src/app/models/driver';
import { DriverStatus } from 'src/app/models/driver-status';
import { get, getWithParams, post, postWithoutHeader, put } from 'src/app/util/requests';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  postSimulateDriveToClient(polyline: google.maps.LatLngLiteral[]) {
    post(this.http, '/driver/simulate-drive-to-client', polyline).subscribe();
  }
  public postSimulateDrive(polyline: google.maps.LatLngLiteral[]): void {
    post(this.http, '/driver/simulate-drive', polyline).subscribe();
  }

  constructor(private http: HttpClient) { }

  public getRides(criteria: string): Observable<ApiResponse<RideDto[]>> {
    return get(this.http, '/driver/rides/' + criteria) as Observable<ApiResponse<RideDto[]>>;
  }

  public getAllActiveDrivers(): Observable<Object> {
    return get(this.http, '/driver/get-all-active');
  }

  public getDriver(): Observable<ApiResponse<Driver>> {
    return get(this.http, '/driver/me') as Observable<ApiResponse<Driver>>;
  }

  public updateDriver(data: FormData): Observable<ApiResponse<null>> {
    return postWithoutHeader(this.http, '/driver/update', data) as Observable<ApiResponse<null>>;
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

  getActiveRide(): Observable<ApiResponse<ActiveRide>> {
    return get(this.http, '/driver/active-ride') as Observable<ApiResponse<ActiveRide>>;
  }

  public registerDriver(data: FormData): Observable<ApiResponse<null>> {
    return postWithoutHeader(this.http, '/driver/signup', data) as Observable<ApiResponse<null>>;
  }

}
