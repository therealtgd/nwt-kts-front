import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { postWithoutHeader } from 'src/app/util/requests';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }
  
  upload(data: FormData): Observable<Object> {
    return postWithoutHeader(this.http, '/image/upload', data);
  }
}
