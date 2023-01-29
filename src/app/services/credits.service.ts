import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { get, post } from '../util/requests';

@Injectable({
  providedIn: 'root'
})
export class CreditsService {

  constructor(private http: HttpClient) { }

  public getAmounts(): Observable<ApiResponse<number>> {
    return get(this.http, '/credits/amounts') as Observable<ApiResponse<number>>;
  }

  public addCredits(amount: number): Observable<ApiResponse<Object>> {
    return post(this.http, '/credits/add', { amount }) as Observable<ApiResponse<Object>>;
  }
}
