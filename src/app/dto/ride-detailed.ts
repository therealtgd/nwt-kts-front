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
  driverRating: number;
  vehicleRating: number;
  startTime: string;
  endTime: string;
}
