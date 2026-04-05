export interface AuthResponseModel {
  token: string;
  roles: "User" | "OwnerHotel";
}
