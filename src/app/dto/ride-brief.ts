import { User } from "./user-brief";

export interface RideDto {
  id: number;
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