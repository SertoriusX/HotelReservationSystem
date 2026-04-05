export interface CityModelRead {
  id: number;
  name: string;
  countryId: number;
  countryName: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}
