import { User } from "./user-brief";

export interface ReviewDto {
  reviewer: User;
  timestamp: String;
  rating: number;
}