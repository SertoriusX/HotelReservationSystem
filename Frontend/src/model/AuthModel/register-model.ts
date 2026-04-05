export interface RegisterModel {
  username: string;
  email: string;
  password: string;
  Roles: "User" | "OwnerHotel";
}
