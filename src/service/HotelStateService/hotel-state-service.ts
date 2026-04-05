import { Injectable, signal } from "@angular/core";
import { HotelModelRead } from "../../model/HotelModel/hotel-model-read";
import { RoomModelRead } from "../../model/RoomModel/room-model-read";
@Injectable({
  providedIn: 'root',
})
export class HotelStateService {
  hotels = signal<HotelModelRead[]>([]);
  rooms = signal<RoomModelRead[]>([]);

  setHotel(hotels: HotelModelRead[]){
    this.hotels.set(hotels)
  }
  setRooms(rooms: RoomModelRead[]){
    this.rooms.set(rooms)
  }
  addHotel(hotel: HotelModelRead){
    if (hotel && hotel.id) {
      this.hotels.update(h=>[...h,hotel])
    }
  }
  updHotel(hotel: HotelModelRead){
    if (hotel && hotel.id) {
      this.hotels.update(h=>h.map(hot=>hot.id===hotel.id?hotel:hot))
    }
  }
  getRoomsByHotel(hotelId: number): RoomModelRead[] {
    return this.rooms().filter(r => r.hotelId === hotelId);
  }

  remove(hotelId: number){
    this.hotels.update(c=>c.filter(h=>h.id !==hotelId))
  }
}