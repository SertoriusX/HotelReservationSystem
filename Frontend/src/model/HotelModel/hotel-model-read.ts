export enum PaymentOptions {
  None = 0,
  CreditCard = 1,
  PayPal = 2,
  HotelDirect = 4,
  PayAtHotel = 8
}

import { HotelImageModelRead } from "../HotelImageModel/hotel-image-model-read";

export interface HotelModelRead {
  id: number;
  name: string;
  description: string;
  cityId: number;
  cityName: string;
  cityLatitude?: number;
  cityLongitude?: number;
  createdAt: string;
  images: HotelImageModelRead[];
  rating: number;
  acceptedPayments?: number;
  allowPayNow?: boolean;
  allowSaveCard?: boolean;
  saveCardFeePercent?: number;
  autoPayDaysBefore?: number;
}
