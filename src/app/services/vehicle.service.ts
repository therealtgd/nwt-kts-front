import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response";
import { VehicleType } from "../models/vehicle-type";
import { get } from "../util/requests";

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    constructor(private http: HttpClient) { }

    public getAllVehicles(): Observable<Object> {
        return get(this.http, '/vehicle/get-all');
    }

    public getAllVehicleTypes(): Observable<ApiResponse<VehicleType[]>> {
        return get(this.http, '/vehicle/types') as Observable<ApiResponse<VehicleType[]>>;
    }
}
