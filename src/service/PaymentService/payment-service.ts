import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PaymentConfirmResponse {
  success: boolean;
  bookingId?: number;
  paymentIntentId?: string;
  status?: string;
}

export interface PayPalCreateOrderResponse {
  orderId: string;
  approvalUrl: string;
}

export interface PayPalCaptureResponse {
  success: boolean;
  transactionId?: string;
  status?: string;
}

export interface HotelDirectPaymentRequest {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

export interface HotelDirectPaymentResponse {
  success: boolean;
  transactionId?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private backUrl = "http://localhost:5009/api/payment";
  
  constructor(private http: HttpClient) {}

  confirmPayment(paymentIntentId: string): Observable<PaymentConfirmResponse> {
    return this.http.get<PaymentConfirmResponse>(`${this.backUrl}/confirm/${paymentIntentId}`);
  }

  createPaymentIntent(amount: number, currency: string = 'usd'): Observable<{ clientSecret: string; paymentIntentId: string }> {
    return this.http.post<{ clientSecret: string; paymentIntentId: string }>(`${this.backUrl}/create-intent`, {
      amount,
      currency
    });
  }

  refundPayment(paymentIntentId: string): Observable<any> {
    return this.http.post<any>(`${this.backUrl}/refund/${paymentIntentId}`, {});
  }

  createPayPalOrder(bookingId: number, amount: number): Observable<PayPalCreateOrderResponse> {
    return this.http.post<PayPalCreateOrderResponse>(`${this.backUrl}/create-paypal`, {
      bookingId,
      amount
    });
  }

  capturePayPalOrder(orderId: string): Observable<PayPalCaptureResponse> {
    return this.http.post<PayPalCaptureResponse>(`${this.backUrl}/capture-paypal/${orderId}`, {});
  }

  createHotelDirectPayment(bookingId: number, amount: number, cardData: HotelDirectPaymentRequest): Observable<HotelDirectPaymentResponse> {
    return this.http.post<HotelDirectPaymentResponse>(`${this.backUrl}/create-hotel?bookingId=${bookingId}`, {
      amount,
      ...cardData
    });
  }
}