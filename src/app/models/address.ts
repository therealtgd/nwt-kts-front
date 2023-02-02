import { LatLngLiteral } from "ngx-google-places-autocomplete/objects/latLng";

export interface Address {
  address: string,
  coordinates: LatLngLiteral,
}
