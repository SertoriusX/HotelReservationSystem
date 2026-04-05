export interface HotelModelCreate {
  name: string;
  description: string;
  cityId: number;
  latitude?: number;
  longitude?: number;
  acceptedPayments?: string[];
}
