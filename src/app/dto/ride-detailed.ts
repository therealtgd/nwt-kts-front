import { AddressDto } from "./address-dto"
import { ReviewDto } from "./review-dto";
import { User } from "./user-brief"

export interface RideDetailed {
  driver: User;
  clients: User[];
  distance: number;
  duration: number;
  stops: AddressDto[];
  reviews: ReviewDto[];
  price: number;
  rating: number;
  startTime: string;
  endTime: string;
}
