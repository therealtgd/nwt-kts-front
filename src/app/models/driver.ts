import { DriverStatus } from "./driver-status";
import { Vehicle } from "./vehicle";

export interface Driver {
    id: number,
    username: string,
    email: string,
    displayName: string,
    enabled: boolean,
    status: DriverStatus,
    vehicle: Vehicle,
    image?: string, 
}