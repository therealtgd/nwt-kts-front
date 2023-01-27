import { FileHandle } from "./file-handle";

export interface RegistrationRequest {
  displayName: String;
  email: String;
  username: String;
  password: String;
  confirmPassword: String;
  phoneNumber: String;
  socialProvider: string;
}