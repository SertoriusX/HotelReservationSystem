import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomModelRead } from '../../model/RoomModel/room-model-read';
import { RoomModelCreate } from '../../model/RoomModel/room-model-create';
import { RoomModelUpdate } from '../../model/RoomModel/room-model-update';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private backUrl="http://localhost:5009/api/Room"
  constructor(private http: HttpClient){}
  getAllRoom(): Observable<RoomModelRead[]>{
    return this.http.get<RoomModelRead[]>(this.backUrl)
  }
  getByIdRoom(id: number): Observable<RoomModelRead>{
    return this.http.get<RoomModelRead>(`${this.backUrl}/${id}`)
  }
  createRoom(room: RoomModelCreate,hotelId:number): Observable<RoomModelRead>{
    return this.http.post<RoomModelRead>(`${this.backUrl}/${hotelId}`, room)
  }
  updateRoom(id: number, room: RoomModelUpdate): Observable<RoomModelUpdate>{
    return this.http.put<RoomModelUpdate>(`${this.backUrl}/${id}`, room)
  }
  deleteRoom(id: number): Observable<void>{
    return this.http.delete<void>(`${this.backUrl}/${id}`)
  }
  getDistance(roomLat: number, roomLng: number, destLat: number, destLng: number): Observable<number>{
    return this.http.get<number>(`${this.backUrl}/distance?roomLat=${roomLat}&roomLng=${roomLng}&destLat=${destLat}&destLng=${destLng}`)
  }
}
