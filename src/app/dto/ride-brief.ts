import { User } from "./user-brief";

export interface Ride {
  driver: User;
  clients: User[];
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  price: string;
  distance: string;
}