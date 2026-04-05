import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WishlishModel } from '../../model/WishlishModel/wishlish-model';
import { WishlishModelCreate } from '../../model/WishlishModel/wishlish-model-create';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
   backUrl = "http://localhost:5009/api/Wishlist"
  constructor(private http: HttpClient){}
  get():Observable<WishlishModel[]>{
    return this.http.get<WishlishModel[]>(this.backUrl)
  }
  addWishList(roomId: number): Observable<any> {
    return this.http.post(`${this.backUrl}/${roomId}`, { roomId }, { responseType: 'text' });
  }
  removeWishList(roomId: number): Observable<any> {
    return this.http.delete(`${this.backUrl}/${roomId}`, { responseType: 'text' });
  }
}