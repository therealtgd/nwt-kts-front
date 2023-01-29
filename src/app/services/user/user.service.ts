import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdatePassword } from 'src/app/dto/update-password';
import { UpdateUser } from 'src/app/dto/update-user';
import { put } from 'src/app/util/requests';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public updateUser(data: UpdateUser) : Observable<Object> {
    return put(this.http, '/user/update', data);
  }

}
