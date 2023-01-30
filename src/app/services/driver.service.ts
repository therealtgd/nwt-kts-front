import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { get } from "../util/requests";

@Injectable({
    providedIn: 'root'
})
export class DriverService {
    constructor(private http: HttpClient) { }

    public getAllActiveDrivers(): Observable<Object> {
        return get(this.http, '/driver/get-all-active');
    }
}