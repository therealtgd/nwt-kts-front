import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RideDto } from 'src/app/dto/ride-brief';
import { User } from 'src/app/dto/user-brief';
import { ApiResponse } from 'src/app/models/api-response';
import { UserDto } from 'src/app/models/user-dto';
import { get, put } from 'src/app/util/requests';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  public getUserInfo(username: string): Observable<ApiResponse<User>> {
    return get(this.http, '/user/get/' + username) as Observable<ApiResponse<User>>;
  }

  public disableUser(id: number) {
    return put(this.http, `/user/${id}/disable`, {});
  }

  public enableUser(id: number) {
    return put(this.http, `/user/${id}/enable`, {});
  }

  public getAllDrivers(): Observable<ApiResponse<UserDto[]>> {
    return get(this.http, '/driver/get-all') as Observable<ApiResponse<UserDto[]>>;
  }

  public getAllClients(): Observable<ApiResponse<UserDto[]>> {
    return get(this.http, '/client/get-all') as Observable<ApiResponse<UserDto[]>>;
  }

  getRidesForDriver(id: number): Observable<ApiResponse<RideDto[]>> {
    return get(this.http, `/driver/${id}/rides/`) as Observable<ApiResponse<RideDto[]>>;
  }

  getRidesForClient(id: number): Observable<ApiResponse<RideDto[]>> {
    return get(this.http, `/client/${id}/rides/`) as Observable<ApiResponse<RideDto[]>>;
  }

}
