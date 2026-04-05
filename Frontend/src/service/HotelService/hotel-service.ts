import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HotelModelRead } from '../../model/HotelModel/hotel-model-read';
import { HotelModelCreate } from '../../model/HotelModel/hotel-model-create';
import { HotelModelUpdate } from '../../model/HotelModel/hotel-model-update';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
    private backUrl = "http://localhost:5009/api/Hotel"

    constructor(private http: HttpClient){}

    getAllHotelByOwner(): Observable<HotelModelRead[]>{
      return this.http.get<HotelModelRead[]>(`${this.backUrl}/my`)
    }

    getByIdHotelByOwner(id: number): Observable<HotelModelRead>{
      return this.http.get<HotelModelRead>(`${this.backUrl}/my/${id}`)
    }

    getAllHotel(): Observable<HotelModelRead[]>{
      return this.http.get<HotelModelRead[]>(this.backUrl)
    }

    getByIdHotel(id: number): Observable<HotelModelRead>{
      return this.http.get<HotelModelRead>(`${this.backUrl}/${id}`)
    }

    createHotel(hotel: HotelModelCreate): Observable<HotelModelRead>{
      return this.http.post<HotelModelRead>(this.backUrl, hotel)
    }

    updateHotel(id: number, hotel: HotelModelUpdate): Observable<HotelModelRead>{
      return this.http.put<HotelModelRead>(`${this.backUrl}/${id}`, hotel)
    }

    deleteHotel(id: number): Observable<void>{
      return this.http.delete<void>(`${this.backUrl}/${id}`)
    }
}