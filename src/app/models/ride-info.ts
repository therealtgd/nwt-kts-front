import { LatLng, LatLngLiteral } from "ngx-google-places-autocomplete/objects/latLng"
import { SimpleDriver } from "./driver/simple-driver"
import { Stop } from "./stop"
import { VehicleType } from "./vehicle-type"
type Address = {
  address: string,
  coordinates: LatLngLiteral,
}

export interface RideInfo {
  distance: number,
  duration: number,
  startAddress: Address,
  endAddress: Address,
  vehicleType: VehicleType,
  driver?: SimpleDriver | null,
  stops: Stop[],
  price: number,
  clients?: string[] | null,
  petsAllowed: boolean,
  babiesAllowed: boolean,
}
