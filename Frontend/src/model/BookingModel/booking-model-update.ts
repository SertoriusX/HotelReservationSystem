import { BookingStatus } from "./booking-model-read";

export interface BookingModelUpdate {
  checkIn?: string;
  checkOut?: string;
  status?: BookingStatus;
}
