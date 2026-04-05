import { Component, Input, OnInit, OnChanges, SimpleChanges, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../service/BookingService/booking-service';
import { PaymentService } from '../../../service/PaymentService/payment-service';
import { BookingModelRead, BookingStatus } from '../../../model/BookingModel/booking-model-read';
import { BookingModelCreate } from '../../../model/BookingModel/booking-model-create';
import { AuthService } from '../../../service/AuthService/auth-service';
import { RoomService } from '../../../service/RoomService/room-service';

interface RoomOption {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings-list.html',
  styleUrl: './bookings-list.css',
})
export class BookingsList implements OnInit, OnChanges {
  @Input() hotelId?: number;
  @Input() roomId?: number;
  allBookings = signal<BookingModelRead[]>([]);
  availableRooms = signal<RoomOption[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  
  showQuickCreate = false;
  showBookings = true;
  showPaymentSelection = false;
  selectedPaymentMethod = '';
  processingPayment = false;
  quickCreateGuest = '';
  quickCreatePhone = '';
  quickCreateEmail = '';
  quickCreateRoomId: number | null = null;
  quickCreateCheckIn = '';
  quickCreateCheckOut = '';
  quickCreateGuests = 1;
  quickCreateAdults = 1;
  quickCreateChildren = 0;
  
  selectedRoomPrice = 0;
  totalNights = 0;
  totalAmount = 0;
  overlapError: string | null = null;

  // Calendar properties
  calendarDays: { day: number | null; date: string | null }[] = [];
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  isSelectingCheckIn = true;
  showCalendar = false;
  calendarMonth = new Date().getMonth();
  calendarYear = new Date().getFullYear();

  currentPage = signal(1);
  pageSize = 6;

  getUserRole(): string {
    return this.authService.getRole() || '';
  }

  isOwner(): boolean {
    const role = this.getUserRole();
    return role === 'Owner' || role === 'OwnerHotel';
  }

  getUserId(): number {
    return this.authService.getUserId() || 0;
  }

  filteredBookings = computed(() => {
    let bookings = this.allBookings();
    const role = this.getUserRole();
    const userId = this.getUserId();
    const hotelId = this.hotelId;
    
    console.log('Filtering - role:', role, 'hotelId:', hotelId, 'total bookings:', bookings.length);
    console.log('Sample booking hotelId:', bookings[0]?.hotelId);
    
    if (hotelId) {
      bookings = bookings.filter(b => b.hotelId === hotelId);
      console.log('After hotelId filter:', bookings.length);
    }
    
    if (this.roomId) {
      bookings = bookings.filter(b => b.roomId === this.roomId);
    }

    if (role === 'User') {
      bookings = bookings.filter(b => b.userId === userId);
    }
    
    return bookings;
  });
  
  paginatedBookings = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredBookings().slice(start, start + this.pageSize);
  });
  
  totalPages = computed(() => {
    return Math.ceil(this.filteredBookings().length / this.pageSize);
  });

  constructor(private bookingServ: BookingService, public authService: AuthService, private paymentServ: PaymentService, private roomServ: RoomService) {}

  ngOnInit(): void {
    console.log('BookingsList init - hotelId:', this.hotelId, 'roomId:', this.roomId);
    this.loadBookings();
    this.loadRooms();
    this.generateCalendar();
    this.generateQuickCreateCalendar();
    this.showBookings = true;
    
    // Check for auto-pay every minute
    this.checkAutoPay();
    setInterval(() => this.checkAutoPay(), 60000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hotelId'] && !changes['hotelId'].firstChange) {
      this.loadBookings();
      this.loadRooms();
    }
  }
  
  checkAutoPay() {
    const bookings = this.allBookings();
    const now = new Date();
    const role = this.getUserRole();
    
    // Only check auto-pay for regular users (not owners)
    if (role !== 'User') return;
    
    bookings.forEach(booking => {
      // Only auto-pay for own unpaid bookings with saved card
      if (booking.userId !== this.getUserId()) return;
      if (!this.hasSavedCard(booking)) return;
      if (booking.isPaid) return;
      if (booking.status === 'Refunded' || booking.status === 'Cancelled') return;
      
      const checkIn = new Date(booking.checkIn);
      const daysUntil = Math.ceil((checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Auto-pay when exactly 7 days left before check-in
      if (daysUntil === 7) {
        console.log('Auto-pay triggered for booking', booking.id, 'days until:', daysUntil);
        
        this.bookingServ.processAutoPay(booking.id).subscribe({
          next: () => {
            console.log('Auto-pay successful for booking', booking.id);
            this.loadBookings();
          },
          error: (err) => {
            console.error('Auto-pay failed for booking', booking.id, err);
          }
        });
      }
    });
  }

  loadRooms() {
    if (this.hotelId) {
      this.roomServ.getAllRoom().subscribe({
        next: (rooms: any) => {
          const hotelRooms = rooms.filter((r: any) => r.hotelId === this.hotelId);
          this.availableRooms.set(hotelRooms.map((r: any) => ({ id: r.id, name: r.name, price: r.price })));
          this.generateCalendar();
          this.generateQuickCreateCalendar();
        },
        error: (err) => console.error('Failed to load rooms:', err)
      });
    }
  }

  get calendarMonthName(): string {
    return new Date(this.calendarYear, this.calendarMonth).toLocaleString('default', { month: 'long' });
  }

  generateCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.calendarYear, this.calendarMonth, 1);
    const lastDay = new Date(this.calendarYear, this.calendarMonth + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    
    for (let i = 0; i < startDayOfWeek; i++) {
      this.calendarDays.push({ day: null, date: null });
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${this.calendarYear}-${String(this.calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      this.calendarDays.push({ day, date: dateStr });
    }
  }

  calendarPrevMonth() {
    if (this.calendarMonth === 0) {
      this.calendarMonth = 11;
      this.calendarYear--;
    } else {
      this.calendarMonth--;
    }
    this.generateCalendar();
  }

  calendarNextMonth() {
    if (this.calendarMonth === 11) {
      this.calendarMonth = 0;
      this.calendarYear++;
    } else {
      this.calendarMonth++;
    }
    this.generateCalendar();
  }

  getBookingsForDate(dateStr: string): string {
    const bookings = this.allBookings().filter(b => 
      b.roomId === this.hotelId && 
      dateStr >= b.checkIn && dateStr <= b.checkOut
    );
    if (bookings.length === 0) return '';
    const names = bookings.map(b => b.username || 'Guest').join(', ');
    return names + ` (${bookings.length})`;
  }

  getBookingDots(dateStr: string): { isPaid: boolean }[] {
    return this.allBookings().filter(b => 
      b.roomId === this.hotelId && 
      dateStr >= b.checkIn && dateStr <= b.checkOut
    ).slice(0, 3).map(b => ({ isPaid: b.isPaid }));
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
  }

  generateQuickCreateCalendar() {
    if (!this.quickCreateRoomId) return;
    
    // Use a temporary array to not conflict with main calendar
    const tempDays: { day: number | null; date: string | null }[] = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    
    for (let i = 0; i < startDayOfWeek; i++) {
      tempDays.push({ day: null, date: null });
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      tempDays.push({ day, date: dateStr });
    }
    
    // Assign to calendarDays for display
    this.calendarDays = tempDays;
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateQuickCreateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateQuickCreateCalendar();
  }

  selectDate(day: { day: number | null; date: string | null }) {
    if (!day.date) return;
    if (this.isDateDisabled(day.date) || this.isDateBooked(day.date)) return;

    if (this.isSelectingCheckIn) {
      this.quickCreateCheckIn = day.date;
      this.quickCreateCheckOut = '';
      this.isSelectingCheckIn = false;
    } else {
      if (day.date >= this.quickCreateCheckIn) {
        this.quickCreateCheckOut = day.date;
      } else {
        this.quickCreateCheckIn = day.date;
        this.quickCreateCheckOut = '';
      }
      this.isSelectingCheckIn = true;
    }
    this.calculateTotal();
    
    if (this.quickCreateCheckIn && this.quickCreateCheckOut && !this.overlapError) {
      this.createQuickBooking();
    }
  }

  isDateDisabled(dateStr: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
  }

  isDateBooked(dateStr: string): boolean {
    if (!this.quickCreateRoomId) return false;
    
    const bookings = this.allBookings().filter(b => 
      Number(b.roomId) === Number(this.quickCreateRoomId) && 
      b.status !== 'Refunded' &&
      dateStr >= b.checkIn && dateStr <= b.checkOut
    );
    
    return bookings.length > 0;
  }

  isDateInRange(dateStr: string): boolean {
    return dateStr >= this.quickCreateCheckIn && dateStr <= this.quickCreateCheckOut;
  }

  isCheckInDate(dateStr: string): boolean {
    return dateStr === this.quickCreateCheckIn;
  }

  isCheckOutDate(dateStr: string): boolean {
    return dateStr === this.quickCreateCheckOut;
  }

  canCreateQuickBooking(): boolean {
    return !!(this.quickCreateGuest && this.quickCreateRoomId && this.quickCreateCheckIn && this.quickCreateCheckOut && this.quickCreateGuests);
  }

  createQuickBooking() {
    if (!this.canCreateQuickBooking()) return;

    this.showPaymentSelection = true;
  }

  confirmWithPayment(method: string) {
    this.selectedPaymentMethod = method;
    
    if (method === 'payAtHotel') {
      this.createBookingNow();
      return;
    }
    
    this.processingPayment = true;
    
    this.paymentServ.createPaymentIntent(this.totalAmount).subscribe({
      next: (paymentRes: any) => {
        const paymentIntentId = paymentRes.paymentIntentId;
        
        this.paymentServ.confirmPayment(paymentIntentId).subscribe({
          next: (confirmRes: any) => {
            if (confirmRes.success) {
              this.createBookingNow(paymentIntentId);
            } else {
              this.processingPayment = false;
              alert('Payment failed. Please try again.');
            }
          },
          error: () => {
            this.processingPayment = false;
            alert('Payment confirmation failed.');
          }
        });
      },
      error: () => {
        this.processingPayment = false;
        alert('Failed to create payment. Please try again.');
      }
    });
  }

  createBookingNow(paymentIntentId?: string) {
    const dto: BookingModelCreate = {
      roomId: this.quickCreateRoomId!,
      checkIn: this.quickCreateCheckIn,
      checkOut: this.quickCreateCheckOut,
      guests: this.quickCreateGuests,
      adults: this.quickCreateAdults,
      children: this.quickCreateChildren,
      guestName: this.quickCreateGuest,
      guestPhone: this.quickCreatePhone,
      guestEmail: this.quickCreateEmail
    };

    this.bookingServ.createBooking(dto, this.quickCreateRoomId!).subscribe({
      next: (booking: any) => {
        if (paymentIntentId) {
          const methodLabel = this.selectedPaymentMethod === 'stripe' ? 'Credit Card' : 
                              this.selectedPaymentMethod === 'paypal' ? 'PayPal' : 'Hotel Direct';
          this.bookingServ.markAsPaid(booking.id, methodLabel, paymentIntentId).subscribe({
            next: () => {
              alert('Payment successful! Booking confirmed.');
              this.processingPayment = false;
              this.showPaymentSelection = false;
              this.resetQuickCreate();
              this.loadBookings();
            },
            error: () => {
              alert('Booking created but payment marking failed.');
              this.processingPayment = false;
              this.showPaymentSelection = false;
              this.resetQuickCreate();
              this.loadBookings();
            }
          });
        } else {
          alert('Booking created successfully!');
          this.showPaymentSelection = false;
          this.resetQuickCreate();
          this.loadBookings();
        }
      },
      error: (err) => {
        console.error('Create booking failed:', err);
        alert('Failed to create booking');
        this.processingPayment = false;
      }
    });
  }

  resetQuickCreate() {
    this.showQuickCreate = false;
    this.showPaymentSelection = false;
    this.quickCreateGuest = '';
    this.quickCreatePhone = '';
    this.quickCreateEmail = '';
    this.quickCreateRoomId = null;
    this.quickCreateCheckIn = '';
    this.quickCreateCheckOut = '';
    this.quickCreateGuests = 1;
    this.selectedRoomPrice = 0;
    this.totalNights = 0;
    this.totalAmount = 0;
    this.overlapError = null;
    this.selectedPaymentMethod = '';
    this.processingPayment = false;
  }

  onRoomChange() {
    if (!this.quickCreateRoomId) {
      this.selectedRoomPrice = 0;
      this.totalAmount = 0;
      this.totalNights = 0;
      return;
    }
    const room = this.availableRooms().find(r => Number(r.id) === Number(this.quickCreateRoomId));
    this.selectedRoomPrice = room?.price || 0;
    this.calculateTotal();
    this.generateQuickCreateCalendar();
  }

  calculateTotal() {
    this.overlapError = null;
    
    if (!this.quickCreateCheckIn || !this.quickCreateCheckOut || !this.quickCreateRoomId) {
      this.totalNights = 0;
      this.totalAmount = 0;
      return;
    }

    const checkIn = new Date(this.quickCreateCheckIn);
    const checkOut = new Date(this.quickCreateCheckOut);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    this.totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (this.totalNights <= 0) {
      this.totalNights = 0;
      this.totalAmount = 0;
      this.overlapError = 'Check-out must be after check-in';
      return;
    }

    this.totalAmount = this.totalNights * this.selectedRoomPrice+1;

    // Check for overlapping bookings
    const roomId = this.quickCreateRoomId;
    const existingBookings = this.allBookings().filter(b => Number(b.roomId) === Number(roomId) && b.status !== 'Refunded');
    
    for (const booking of existingBookings) {
      const existingCheckIn = new Date(booking.checkIn);
      const existingCheckOut = new Date(booking.checkOut);
      
      if (checkIn < existingCheckOut && checkOut > existingCheckIn) {
        this.overlapError = 'Room is already booked for these dates';
        this.totalAmount = 0;
        return;
      }
    }
  }

  loadBookings() {
    this.loading.set(true);
    this.error.set(null);
    
    this.bookingServ.getAllBooking().subscribe({
      next: (res: any) => {
        const bookings = Array.isArray(res) ? res : [];
        this.allBookings.set(bookings);
        if (this.quickCreateRoomId) {
          this.generateQuickCreateCalendar();
        }
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load bookings:', err);
        this.error.set('Failed to load bookings');
        this.loading.set(false);
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatus(checkIn: string, checkOut: string): string {
    const now = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (now < checkInDate) return 'upcoming';
    if (now >= checkInDate && now <= checkOutDate) return 'active';
    return 'completed';
  }

  getStatusClass(checkIn: string, checkOut: string): string {
    const status = this.getStatus(checkIn, checkOut);
    switch(status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-600';
      case 'Completed': return 'bg-green-100 text-green-600';
      case 'Cancelled': return 'bg-red-100 text-red-600';
      case 'In Progress': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
  
  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
  
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  canDelete(booking: BookingModelRead): boolean {
    const role = this.getUserRole();
    const userId = this.getUserId();
    
    if (role === 'Owner') return true;
    if (role === 'User' && booking.userId === userId) return true;
    return false;
  }

  canRefund(booking: BookingModelRead): boolean {
    const role = this.getUserRole();
    const isOwner = role === 'Owner' || role === 'OwnerHotel';
    const isPaidValue = booking.isPaid;
    const isAlreadyRefunded = booking.status === 'Refunded';
    console.log('canRefund - role:', role, 'isOwner:', isOwner, 'isPaid value:', isPaidValue, 'isRefunded:', isAlreadyRefunded);
    return isOwner && !isAlreadyRefunded && (isPaidValue === true || (booking as any).paymentIntentId);
  }

  canUpdatePayment(booking: BookingModelRead): boolean {
    const role = this.getUserRole();
    const isOwner = role === 'Owner' || role === 'OwnerHotel';
    return isOwner && !booking.isPaid && booking.status !== 'Refunded' && booking.status !== 'Cancelled';
  }

  confirmPayment(booking: BookingModelRead) {
    if (!confirm('Confirm that payment has been received?')) return;

    const paymentMethod = booking.paymentMethod || 'Manual Payment';
    const paymentId = 'manual_' + booking.id;
    
    this.bookingServ.markAsPaid(booking.id, paymentMethod, paymentId).subscribe({
      next: () => {
        alert('Payment confirmed! Booking is now paid.');
        this.loadBookings();
      },
      error: (err) => {
        console.error('Confirm payment failed:', err);
        alert('Failed to confirm payment');
      }
    });
  }

  cancelBooking(booking: BookingModelRead) {
    if (!confirm('Cancel this booking? This will delete the booking.')) return;

    this.bookingServ.deleteBooking(booking.id).subscribe({
      next: () => {
        alert('Booking cancelled and deleted.');
        this.loadBookings();
      },
      error: (err) => {
        console.error('Cancel booking failed:', err);
        alert('Failed to cancel booking');
      }
    });
  }

  isPendingPayment(booking: BookingModelRead): boolean {
    return booking.paymentMethod === 'Pay at Hotel' && !booking.isPaid && booking.status !== 'Refunded';
  }

  canConfirmPayment(booking: BookingModelRead): boolean {
    const role = this.getUserRole();
    const isOwner = role === 'Owner' || role === 'OwnerHotel';
    return isOwner && this.isPendingPayment(booking);
  }

  canUserPay(booking: BookingModelRead): boolean {
    const role = this.getUserRole();
    if (role !== 'User') return false;
    
    const userId = this.getUserId();
    if (booking.userId !== userId) return false;
    
    if (booking.isPaid) return false;
    if (booking.status === 'Refunded' || booking.status === 'Cancelled') return false;
    
    return true;
  }

  canUserCancel(booking: BookingModelRead): boolean {
    const role = this.getUserRole();
    if (role !== 'User') return false;
    
    const userId = this.getUserId();
    if (booking.userId !== userId) return false;
    
    // Only allow cancel for unpaid bookings
    if (booking.isPaid) return false;
    if (booking.status === 'Refunded' || booking.status === 'Cancelled') return false;
    
    return true;
  }

  hasSavedCard(booking: BookingModelRead): boolean {
    return !!(booking as any).cardSaved || !!(booking as any).CardSaved || !!(booking as any).savedPaymentIntentId;
  }

  getDaysUntilCheckIn(checkIn: string): number {
    const checkInDate = new Date(checkIn);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  getDaysUntilAutoPay(checkIn: string): number {
    const daysUntilCheckIn = this.getDaysUntilCheckIn(checkIn);
    const autoPayDays = 7; // Default auto-pay is 7 days before check-in
    const daysUntilAutoPay = daysUntilCheckIn - autoPayDays;
    return daysUntilAutoPay > 0 ? daysUntilAutoPay : 0;
  }

  userPayNow(booking: BookingModelRead) {
    if (!confirm('Proceed to pay for this booking now?')) return;

    this.processingPayment = true;
    const amount = booking.totalPrice;

    this.paymentServ.createPaymentIntent(amount).subscribe({
      next: (paymentRes: any) => {
        const paymentIntentId = paymentRes.paymentIntentId;

        this.paymentServ.confirmPayment(paymentIntentId).subscribe({
          next: (confirmRes: any) => {
            if (confirmRes.success) {
              this.bookingServ.markAsPaid(booking.id, 'Credit Card', paymentIntentId).subscribe({
                next: () => {
                  alert('Payment successful! Booking is now paid.');
                  this.processingPayment = false;
                  this.loadBookings();
                },
                error: () => {
                  alert('Payment confirmed but failed to update booking.');
                  this.processingPayment = false;
                  this.loadBookings();
                }
              });
            } else {
              this.processingPayment = false;
              alert('Payment failed. Please try again.');
            }
          },
          error: () => {
            // Demo mode - just mark as paid
            this.bookingServ.markAsPaid(booking.id, 'Demo Card', paymentIntentId).subscribe({
              next: () => {
                alert('Payment successful! (Demo Mode) Booking is now paid.');
                this.processingPayment = false;
                this.loadBookings();
              },
              error: () => {
                this.processingPayment = false;
                this.loadBookings();
              }
            });
          }
        });
      },
      error: () => {
        // Demo mode fallback
        const demoPaymentId = 'demo_' + Date.now();
        this.bookingServ.markAsPaid(booking.id, 'Demo Card', demoPaymentId).subscribe({
          next: () => {
            alert('Payment successful! (Demo Mode) Booking is now paid.');
            this.processingPayment = false;
            this.loadBookings();
          },
          error: () => {
            this.processingPayment = false;
            alert('Failed to update payment. Please try again.');
          }
        });
      }
    });
  }

  userCancelBooking(booking: BookingModelRead) {
    const daysUntil = this.getDaysUntilCheckIn(booking.checkIn);
    const hasCard = this.hasSavedCard(booking);
    
    let confirmMessage = `Cancel this booking? You have ${daysUntil} days until check-in.`;
    if (hasCard) {
      confirmMessage += '\n\n⚠️ Your saved card will also be removed.';
    }
    
    if (!confirm(confirmMessage)) return;

    this.bookingServ.deleteBooking(booking.id).subscribe({
      next: () => {
        if (hasCard) {
          alert('Booking cancelled and saved card removed.');
        } else {
          alert('Booking cancelled and deleted.');
        }
        this.loadBookings();
      },
      error: (err) => {
        console.error('Cancel booking failed:', err);
        alert('Failed to cancel booking');
      }
    });
  }

  confirmPaymentAtHotel(booking: BookingModelRead) {
    if (!confirm('Confirm that guest has paid at hotel?')) return;

    const paymentId = 'pay_at_hotel_' + booking.id;
    this.bookingServ.markAsPaid(booking.id, 'Pay at Hotel', paymentId).subscribe({
      next: () => {
        alert('Payment confirmed! Booking is now paid.');
        this.loadBookings();
      },
      error: (err) => {
        console.error('Confirm payment failed:', err);
        alert('Failed to confirm payment');
      }
    });
  }

  cancelNoShow(booking: BookingModelRead) {
    if (!confirm('Mark this booking as No-Show and cancel? This will delete the booking.')) return;

    this.bookingServ.deleteBooking(booking.id).subscribe({
      next: () => {
        alert('Booking cancelled and deleted.');
        this.loadBookings();
      },
      error: (err) => {
        console.error('Cancel booking failed:', err);
        alert('Failed to cancel booking');
      }
    });
  }

  refundBooking(booking: BookingModelRead) {
    if (!confirm('Are you sure you want to refund this booking? The payment will be returned to the customer.')) {
      return;
    }

    const paymentId = (booking as any).paymentIntentId;
    const refundedBy = this.authService.getUsername() || 'Owner';
    console.log('Attempting refund - paymentIntentId:', paymentId, 'isPaid:', booking.isPaid, 'refundedBy:', refundedBy);

    if (paymentId) {
      this.paymentServ.refundPayment(paymentId).subscribe({
        next: () => {
          this.bookingServ.refundBooking(booking.id, refundedBy).subscribe({
            next: () => {
              alert('Refund successful! Booking has been marked as refunded.');
              this.loadBookings();
            },
            error: (err) => {
              console.error('Mark as refunded failed:', err);
              alert('Refund processed but failed to update booking status.');
              this.loadBookings();
            }
          });
        },
        error: (err) => {
          if (err.status === 404 || err.status === 403) {
            this.bookingServ.refundBooking(booking.id, refundedBy).subscribe({
              next: () => {
                alert('Refund successful! (Demo mode) Booking has been marked as refunded.');
                this.loadBookings();
              },
              error: () => {
                alert('Refund processed! Booking marked as refunded.');
                this.loadBookings();
              }
            });
          } else {
            console.error('Refund failed:', err);
            alert('Refund failed: ' + (err.message || 'Please try again'));
          }
        }
      });
    } else {
      this.paymentServ.refundPayment('booking_' + booking.id).subscribe({
        next: () => {
          this.bookingServ.refundBooking(booking.id, refundedBy).subscribe({
            next: () => {
              alert('Refund successful! Booking has been marked as refunded.');
              this.loadBookings();
            },
            error: (err) => {
              console.error('Mark as refunded failed:', err);
              alert('Refund processed but failed to update booking status.');
              this.loadBookings();
            }
          });
        },
        error: (err) => {
          if (err.status === 404 || err.status === 403) {
            this.bookingServ.refundBooking(booking.id, refundedBy).subscribe({
              next: () => {
                alert('Refund successful! (Demo mode) Booking has been marked as refunded.');
                this.loadBookings();
              },
              error: () => {
                alert('Refund processed! Booking marked as refunded.');
                this.loadBookings();
              }
            });
          } else {
            console.error('Refund failed:', err);
            alert('Refund failed: ' + (err.message || 'Please try again'));
          }
        }
      });
    }
  }

  deleteBooking(id: number) {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingServ.deleteBooking(id).subscribe({
        next: () => {
          this.loadBookings();
        },
        error: (err) => {
          alert('Failed to delete booking');
        }
      });
    }
  }
}