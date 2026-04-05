import { Injectable, signal } from '@angular/core';
import { RoomImageModelRead } from '../../model/RoomImageModel/room-image-model-read';

@Injectable({
  providedIn: 'root',
})
export class RoomImgState {
   roomImg=signal<RoomImageModelRead[]>([])

   setRoomImg(images: RoomImageModelRead[]){
       this.roomImg.set(images);
    }
   addRoomImg(roomAdd:RoomImageModelRead){
    return this.roomImg.update(r=>[...r,roomAdd])
   }
   updateRoomImg(updateRoomImg:RoomImageModelRead){
    return this.roomImg.update(room=>room.map(r=>r.id===updateRoomImg.id?updateRoomImg:r))
   }
   deleteRoomImg(id:number){
    return this.roomImg.update(r=>r.filter(room=>room.id!==id))
   }

}
