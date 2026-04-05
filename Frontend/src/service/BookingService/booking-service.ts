import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingModelRead } from '../../model/BookingModel/booking-model-read';
import { BookingModelCreate } from '../../model/BookingModel/booking-model-create';
import { BookingModelUpdate } from '../../model/BookingModel/booking-model-update';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
    private backUrl="http://localhost:5009/api/Booking"
    constructor(private http: HttpClient){}
    
    getAllBooking(roomId?: number): Observable<BookingModelRead[]>{
      const url = roomId ? `${this.backUrl}/${roomId}` : this.backUrl;
      return this.http.get<BookingModelRead[]>(url)
    }
    getByIdBooking(id: number): Observable<BookingModelRead>{
      return this.http.get<BookingModelRead>(`${this.backUrl}/${id}`)
    }
    getBookingsByRoom(roomId: number): Observable<BookingModelRead[]>{
      return this.http.get<BookingModelRead[]>(`${this.backUrl}/${roomId}`)
    }
    createBooking(booking: BookingModelCreate,roomId: number): Observable<BookingModelRead>{
      return this.http.post<BookingModelRead>(`${this.backUrl}/${roomId}`, booking)
    }
    updateBooking(id: number, updBooking: BookingModelUpdate): Observable<BookingModelUpdate>{
      return this.http.put<BookingModelUpdate>(`${this.backUrl}/${id}`, updBooking)
    }
    deleteBooking(id: number): Observable<void>{
      return this.http.delete<void>(`${this.backUrl}/${id}`)
    }
    markAsPaid(id: number, paymentMethod: string, paymentIntentId?: string): Observable<BookingModelRead>{
      return this.http.patch<BookingModelRead>(`${this.backUrl}/${id}/pay`, { 
        paymentMethod,
        paymentIntentId 
      })
    }
    refundBooking(id: number, refundedBy?: string): Observable<any>{
      return this.http.post<any>(`${this.backUrl}/${id}/refund`, { refundedBy })
    }
    getPendingAutoPay(): Observable<BookingModelRead[]>{
      return this.http.get<BookingModelRead[]>(`${this.backUrl}/pending-auto-pay`)
    }
    processAutoPay(id: number): Observable<any>{
      return this.http.post<any>(`${this.backUrl}/${id}/auto-pay`, {})
    }
    processAllAutoPay(): Observable<any>{
      return this.http.post<any>(`${this.backUrl}/process-all-auto-pay`, {})
    }
    getAvailableRooms(checkIn: string, checkOut: string): Observable<{availableRoomIds: number[]}>{
      return this.http.get<{availableRoomIds: number[]}>(`${this.backUrl}/available-rooms?checkIn=${checkIn}&checkOut=${checkOut}`)
    }
}
