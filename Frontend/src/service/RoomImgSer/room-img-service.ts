import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomImageModelRead } from '../../model/RoomImageModel/room-image-model-read';
import { RoomImageModelCreate } from '../../model/RoomImageModel/room-image-model-create';
import { RoomImageModelUpdate } from '../../model/RoomImageModel/room-image-model-update';

@Injectable({
  providedIn: 'root',
})
export class RoomImgService {

  private backUrl="http://localhost:5009/api/RoomImg"
  constructor(private http:HttpClient){}

  allRoomImg(id:number):Observable<RoomImageModelRead[]>{
    return this.http.get<RoomImageModelRead[]>(`${this.backUrl}/${id}`)
  }
    byIdRoomImg(id:number):Observable<RoomImageModelRead>{
    return this.http.get<RoomImageModelRead>(`${this.backUrl}/${id}`)
  }

  createRoomImg(roomId:number,room:RoomImageModelCreate):Observable<RoomImageModelRead>{
    return this.http.post<RoomImageModelRead>(`${this.backUrl}/${roomId}`,room)
  }
  updateRoomId(id:number,room:RoomImageModelUpdate):Observable<RoomImageModelRead>{
    return this.http.put<RoomImageModelRead>(`${this.backUrl}/${id}`,room)
  }
  removeRoomImg(id:number):Observable<void>{
    return this.http.delete<void>(`${this.backUrl}/${id}`)
  }
}
