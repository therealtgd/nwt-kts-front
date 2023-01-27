import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { post } from 'src/app/util/requests';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }
  
  upload(data: FormData): Observable<Object> {
    return post(this.http, '/image/upload', data, undefined);
  }
}
