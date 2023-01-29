import { LatLng, LatLngLiteral } from "ngx-google-places-autocomplete/objects/latLng"
import { Stop } from "./stop"
import { VehicleType } from "./vehicle-type"

type TextValue = {
  text: string,
  value: number,
}

type Address = {
  address: string,
  coordinates: LatLngLiteral,
}

export interface RideInfo {
  distance: TextValue,
  duration: TextValue,
  startAddress: Address,
  endAddress: Address,
  vehicleType: VehicleType,
  driver?: string | null,
  stops: Stop[],
  price: number,
}
