import { User } from "../dto/user-brief";
import { Address } from "./address";
import { Driver } from "./driver";

export interface ActiveRide {
  id: number,
  driver: Driver,
  clients: User[],
  startTime: number,
  endTime: number,
  startAddress: Address,
  endAddress: Address,
  stops: Address[],
  price: string,
  distance: string,
  eta: number,
}
