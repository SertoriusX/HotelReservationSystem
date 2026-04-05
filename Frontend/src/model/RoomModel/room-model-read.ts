import { RoomImageModelRead } from "../RoomImageModel/room-image-model-read";

export interface RoomModelRead {
  id: number;
  name: string;
  description?: string;
  price: number;
  capacity: number;
  hotelId: number;
  hotelName: string;
  cityName?: string;
  cityLatitude?: number;
  cityLongitude?: number;
  imgs?: RoomImageModelRead[];
  numberOfBedrooms: number;
  numberOfBeds: number;
  latitude?: number;
  longitude?: number;

  type: string;

  hasKitchen: boolean;
  hasWifi: boolean;
  hasAirConditioning: boolean;
  hasTv: boolean;
  hasFreeParging: boolean;

  isNonSmoking: boolean;
  hasSwimmingPool: boolean;
  hasBar: boolean;

  createdAt: string;
  acceptedPayments?: number;
  allowPayNow?: boolean;
  allowSaveCard?: boolean;
  saveCardFeePercent?: number;
  autoPayDaysBefore?: number;
}