export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
  Paid = 'Paid',
  Refunded = 'Refunded'
}

export interface BookingModelRead {
  id: number;
  userId: number;
  roomId: number;
  hotelId?: number;
  username?: string;
  userEmail?: string;
  userPhone?: string;
  roomName?: string;
  hotelName?: string;
  pricePerNight: number;
  checkIn: string;
  checkOut: string;
  daysCount: number;
  adults: number;
  children: number;
  totalPrice: number;
  status: BookingStatus;
  isPaid: boolean;
  paymentMethod?: string;
  paymentIntentId?: string;
  refundedBy?: string;
  refundedAt?: string;
  createdAt?: string;
  cardSaved?: boolean;
  savedPaymentIntentId?: string;
}
