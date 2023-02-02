import { AddressDto } from "../dto/address-dto"
import { SimpleDriver } from "./driver/simple-driver"
import { Stop } from "./stop"
import { VehicleType } from "./vehicle-type"

export interface RideInfo {
  distance: number,
  duration: number,
  startAddress: AddressDto,
  endAddress: AddressDto,
  vehicleType: VehicleType,
  driver?: SimpleDriver | null,
  stops: Stop[],
  price: number,
  clients?: string[] | null,
  petsAllowed: boolean,
  babiesAllowed: boolean,
}
