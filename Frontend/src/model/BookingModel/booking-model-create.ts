export interface BookingModelCreate {
  roomId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults?: number;
  children?: number;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  paymentMethod?: string;
  cardSaved?: boolean;
  paymentIntentId?: string;
  paymentStatus?: 'Pending' | 'Paid' | 'AutoPaid';
  totalAmount?: number;
}
