import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { get } from "../util/requests";

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    constructor(private http: HttpClient) { }

    public getAllVehicles(): Observable<Object> {
        return get(this.http, '/vehicle/get-all');
    }
}