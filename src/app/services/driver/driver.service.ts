import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RideDto } from 'src/app/dto/ride-brief';
import { ApiResponse } from 'src/app/models/api-response';
import { get } from 'src/app/util/requests';

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

}
