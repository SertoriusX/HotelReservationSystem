import { Injectable, signal } from '@angular/core';
import { HotelModelRead } from '../../model/HotelModel/hotel-model-read';

@Injectable({
  providedIn: 'root',
})
export class HotelState {
  hotelState=signal<HotelModelRead[]>([])

  setHotel(hotel:HotelModelRead[]){
    return this.hotelState.set(hotel)
  }

addHotel(hotel: HotelModelRead) {

  return this.hotelState.update(curr => [...curr, hotel]);
}

updHotel (hotel:HotelModelRead,id:number){
  this.hotelState.update(curr=>(curr.map(c=>(c.id!==id?{...c,...hotel}:c))))
}
delHotel(id:number){
  this.hotelState.update(curr=>(curr.filter(c=>c.id!==id)))
}
}
