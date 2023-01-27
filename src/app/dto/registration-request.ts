export interface RegistrationRequest {
  displayName: String;
  email: String;
  username: String;
  password: String;
  confirmPassword: String;
  phoneNumber: String;
  image: String;
  socialProvider: string;
}