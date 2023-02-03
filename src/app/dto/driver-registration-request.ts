export interface DriverRegistrationRequest {
  displayName: String;
  email: String;
  username: String;
  phoneNumber: String;
  city: String;
  password: String;
  confirmPassword: String;
  imageUploaded: boolean;
  capacity: number;
  licencePlate: string;
  vehicleType: string;
  petsAllowed: boolean;
  babiesAllowed: boolean;
}