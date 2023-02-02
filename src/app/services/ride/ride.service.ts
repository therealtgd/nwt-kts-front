import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getWithParams, get, post } from 'src/app/util/requests';
import { Observable } from 'rxjs';
import { RideInfo } from 'src/app/models/ride-info';
import { ApiResponse } from 'src/app/models/api-response';
import { SimpleDriver } from 'src/app/models/driver/simple-driver';
import { ReportDto } from 'src/app/dto/report-dto';
import { ActiveRide } from 'src/app/models/active-ride';

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

  public getDriver(rideInfo: RideInfo): Observable<ApiResponse<SimpleDriver>> {
    const params = new HttpParams()
      .set('vehicleType', rideInfo.vehicleType)
      .set('petsAllowed', rideInfo.petsAllowed)
      .set('babiesAllowed', rideInfo.babiesAllowed)
      .set('lat', rideInfo.startAddress.coordinates.lat)
      .set('lng', rideInfo.startAddress.coordinates.lng);

    return getWithParams(this.http, '/ride/nearest-free-driver', params) as Observable<ApiResponse<SimpleDriver>>;
  }

  public orderRide(rideInfo: RideInfo): Observable<ApiResponse<ActiveRide>> {
    return post(this.http, '/ride/order', rideInfo) as Observable<ApiResponse<ActiveRide>>;
  }

  public getClientReport(startDate: string, endDate: string): Observable<ApiResponse<ReportDto>> {
    return get(this.http, '/ride/report/client/' + startDate + '/' + endDate) as Observable<ApiResponse<ReportDto>>;
  }

  public getDriverReport(startDate: string, endDate: string): Observable<ApiResponse<ReportDto>> {
    return get(this.http, '/ride/report/driver/' + startDate + '/' + endDate) as Observable<ApiResponse<ReportDto>>;
  }

  public getAdminReport(startDate: string, endDate: string): Observable<ApiResponse<ReportDto>> {
    return get(this.http, '/ride/report/admin/' + startDate + '/' + endDate) as Observable<ApiResponse<ReportDto>>;
  }

  getDriverEta(): Observable<ApiResponse<number>> {
    return get(this.http, '/ride/driver-eta') as Observable<ApiResponse<number>>;
  }

}
