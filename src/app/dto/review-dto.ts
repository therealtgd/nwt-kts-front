import { User } from "./user-brief";

export interface ReviewDto {
  reviewer: User;
  timestamp: String;
  driverRating: number;
  vehicleRating: number;
  comment: string;
}