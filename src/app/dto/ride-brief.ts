import { User } from "./user-brief";

export interface RideDto {
  id: string;
  driver: User;
  clients: User[];
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  price: string;
  distance: string;
  favorite: boolean;
}