import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RegistrationRequest } from "../dto/RegistrationRequest";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) { }

  url = "http://localhost:8080/client";

  public registerClient(data: RegistrationRequest) : Observable<Object> {
    return this.http.post(this.url + '/register', data, { headers: new HttpHeaders().set('Content-Type', 'application/json'), responseType: 'json' });
  }
}