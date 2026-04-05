export interface RoomModelCreate {
  name: string;
  price: number;
  capacity: number;
  type?: string;
  
  hasKitchen: boolean;
  hasWifi: boolean;
  hasAirConditioning: boolean;
  hasTv: boolean;

  isNonSmoking: boolean;
  hasSwimmingPool: boolean;
  hasBar: boolean;
  numberOfBedrooms: number;
  numberOfBeds: number;
  latitude: number;
  longitude: number;
}