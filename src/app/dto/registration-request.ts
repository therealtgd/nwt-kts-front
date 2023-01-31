export interface RegistrationRequest {
  displayName: String;
  email: String;
  username: String;
  phoneNumber: String;
  city: String;
  password: String;
  confirmPassword: String;
  socialProvider: string;
}