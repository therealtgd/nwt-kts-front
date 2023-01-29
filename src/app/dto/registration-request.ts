export interface RegistrationRequest {
  displayName: String;
  email: String;
  username: String;
  password: String;
  confirmPassword: String;
  socialProvider: string;
}