import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';
import { postWithoutHeader } from 'src/app/util/requests';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }
  
  upload(data: FormData): Observable<ApiResponse<null>> {
    return postWithoutHeader(this.http, '/image/upload', data) as Observable<ApiResponse<null>>;
  }
}
