import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getToken } from 'src/app/util/context';
import { apiUrl } from 'src/app/util/requests';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const contentType: string = request.headers.get('Content-Type') || 'application/json';
    const token: string = getToken();
    if (request.url.includes(apiUrl) && token && !request.url.includes('image')) {

      request = request.clone({
        setHeaders: {
          'Content-Type': contentType,
          responseType : 'json',
          Authorization: `Bearer ${getToken()}`
        }
      });
      
    }

    return next.handle(request);

  }
}
