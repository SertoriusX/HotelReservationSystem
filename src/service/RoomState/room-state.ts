import { Injectable, signal } from '@angular/core';
import { RoomModelRead } from '../../model/RoomModel/room-model-read';

@Injectable({
  providedIn: 'root',
})
export class RoomState {
  rooms=signal<RoomModelRead[]>([])
  room= signal<RoomModelRead | null>(null);
  setRoom(room:RoomModelRead[]){
    this.rooms.set(room);
  }
  clearRooms() {
    this.rooms.set([]);
  }
  addRoom(room:RoomModelRead){
    this.rooms.update(r=>[...r,room])
  }
  updateRoom(updMovie:RoomModelRead){
    this.rooms.update(r=>r.map(room=>room.id===updMovie.id?updMovie:room))
  }
  removeRoom(removeId:number){
    this.rooms.update(r=>r.filter(room=>room.id!==removeId))
  }
}
