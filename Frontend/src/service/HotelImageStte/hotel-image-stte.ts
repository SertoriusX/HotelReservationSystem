import { Injectable, signal } from '@angular/core';
import { HotelImageModelRead } from '../../model/HotelImageModel/hotel-image-model-read';

@Injectable({
  providedIn: 'root',
})
export class HotelImageStte {
  hotelImage=signal<HotelImageModelRead[]>([])
  setImage(hImage:HotelImageModelRead[]){

    this.hotelImage.set(hImage)
  }
  addImage(hImage:HotelImageModelRead){
    this.hotelImage.update(hotel=>[...hotel,hImage])

  }

  removeImage(hId:number){
    this.hotelImage.update(hotel=>hotel.filter(img=>img.id!==hId))
  }
}
