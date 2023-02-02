import { DriverStatus } from "./driver-status";

export interface SimpleDriver {
    id: number,
    displayName: string,
    status: DriverStatus,
    isReserved: boolean,
}