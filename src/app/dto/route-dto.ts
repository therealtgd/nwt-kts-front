import { AddressDto } from "./address-dto";

export interface RouteDto {
  id: string;
  stops: AddressDto[];
}