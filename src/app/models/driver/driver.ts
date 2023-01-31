import { Vehicle } from "../vehicle";
import { DriverStatus } from "./driver-status";

export interface Driver {
    id: number,
    username: string,
    email: string,
    displayName: string,
    enabled: boolean,
    status: DriverStatus,
    vehicle: Vehicle,
}
