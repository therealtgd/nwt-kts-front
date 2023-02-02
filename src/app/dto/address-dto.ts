import { LatLngLiteral } from "ngx-google-places-autocomplete/objects/latLng";

export interface AddressDto {
  address: string,
  coordinates: LatLngLiteral,
}