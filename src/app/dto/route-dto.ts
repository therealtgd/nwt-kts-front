import { AddressDto } from "./address-dto";

export interface RouteDto {
  id: number;
  stops: AddressDto[];
}