import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HotelImageModelRead } from '../../model/HotelImageModel/hotel-image-model-read';
import { HotelImageModelCreate } from '../../model/HotelImageModel/hotel-image-model-create';
import { HotelImageModelUpdate } from '../../model/HotelImageModel/hotel-image-model-update';

@Injectable({
  providedIn: 'root',
})
export class HotelImageService {
   private backUrl="http://localhost:5009/api/HotelImage"
   constructor(private http: HttpClient){}
   getAllImage(): Observable<HotelImageModelRead[]>{
     return this.http.get<HotelImageModelRead[]>(this.backUrl)
   }
   getByIdImage(id: number): Observable<HotelImageModelRead>{
     return this.http.get<HotelImageModelRead>(`${this.backUrl}/${id}`)
   }
   createImage(image: HotelImageModelCreate,hotelId:number): Observable<HotelImageModelRead>{
     return this.http.post<HotelImageModelRead>(`${this.backUrl}/${hotelId}`, image)
   }
   updateImage(id: number, image: HotelImageModelUpdate): Observable<HotelImageModelUpdate>{
     return this.http.put<HotelImageModelUpdate>(`${this.backUrl}/${id}`, image)
   }
   deleteImage(id: number): Observable<void>{
     return this.http.delete<void>(`${this.backUrl}/${id}`)
   }
}
