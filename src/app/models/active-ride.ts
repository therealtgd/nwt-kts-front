import { User } from "../dto/user-brief";
import { Address } from "./address";
import { Driver } from "./driver";

export interface ActiveRide {
  driver: Driver,
  clients: User[],
  startTime: string,
  endTime: string,
  startAddress: Address,
  endAddress: Address,
  stops: Address[],
  price: string,
  distance: string,
  eta: number,
}
