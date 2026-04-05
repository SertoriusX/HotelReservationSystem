export interface RoomModelUpdate {
  name?: string;
  description?: string;
  price?: number;
  capacity?: number;

  numberOfBedrooms?: number;
  numberOfBeds?: number;

  type?: string;

  hasKitchen?: boolean;
  hasWifi?: boolean;
  hasAirConditioning?: boolean;
  hasTv?: boolean;

  isNonSmoking?: boolean;
  hasSwimmingPool?: boolean;
  hasBar?: boolean;
  latitude?: number;
  longitude?: number;
}