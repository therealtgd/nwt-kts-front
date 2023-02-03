import { DriverStatus } from "./driver-status";

export interface SimpleDriver {
    id: number,
    username: string,
    displayName: string,
    status: DriverStatus,
    isReserved: boolean,
}