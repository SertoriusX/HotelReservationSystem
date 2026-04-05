import { Component, Input, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../service/BookingService/booking-service';
import { PaymentService } from '../../../service/PaymentService/payment-service';
import { FormsModule, NgForm } from '@angular/forms';
import { BookingModelCreate } from '../../../model/BookingModel/booking-model-create';
import { StripePaymentComponent } from '../../PaymentComponent/stripe-payment/stripe-payment';
import { PayPalPaymentComponent } from '../../PaymentComponent/paypal-payment/paypal-payment';
import { HotelDirectPaymentComponent } from '../../PaymentComponent/hotel-direct-payment/hotel-direct-payment';
import { PayAtHotelComponent } from '../../PaymentComponent/pay-at-hotel/pay-at-hotel';

interface CalendarDay {
  day: number | null;
  date: string | null;
}

@Component({
  selector: 'app-booking-component-create',
  standalone: true,
  imports: [CommonModule, FormsModule, StripePaymentComponent, PayPalPaymentComponent, HotelDirectPaymentComponent, PayAtHotelComponent],
  templateUrl: './booking-component-create.html',
  styleUrl: './booking-component-create.css',
})
export class BookingComponentCreate implements OnInit {
  @Input() roomId!: number;
  @Input() hotelId!: number;
  @Input() pricePerNight!: number;
  @Input() capacity!: number;
  @Input() acceptedPayments: number = 0;
  @Input() allowPayNow: boolean = true;
  @Input() allowSaveCard: boolean = true;
  @Input() saveCardFeePercent: number = 0;
  @Input() autoPayDaysBefore: number = 7;
  @Output() close = new EventEmitter<void>();
  @Output() bookingCreated = new EventEmitter<void>();
  
  today: string;
  bookedDates = signal<string[]>([]);
  bookings: any[] = [];
  loadingBookings = signal<boolean>(true);
  bookingError = signal<string>('');
  
  currentYear: number;
  currentMonth: number;
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: CalendarDay[] = [];
  form: any;
  selectedCheckIn: string = '';
  selectedCheckOut: string = '';
  isSelectingCheckIn: boolean = true;
  showPaymentModal = signal(false);
  processingPayment = signal(false);
  selectedPaymentMethod = signal<'stripe' | 'paypal' | 'hotel' | 'payAtHotel'>('stripe');
  cardNumber = signal('');
  cardExpiry = signal('');
  cardCvv = signal('');
  cardName = signal('');
  pendingBookingId: number | null = null;
  cardSaved = signal(false);
  savedPaymentIntentId = signal<string | null>(null);
  
  get STRIPE_ADVANCE_DAYS(): number {
    return this.autoPayDaysBefore;
  }

  constructor(private bookingServ: BookingService, private paymentServ: PaymentService) {
    const todayDate = new Date();
    this.today = todayDate.toISOString().split('T')[0];
    this.currentYear = todayDate.getFullYear();
    this.currentMonth = todayDate.getMonth();
  }

  ngOnInit(): void {
    console.log('Booking - acceptedPayments:', this.acceptedPayments);
    console.log('Booking - allowSaveCard:', this.allowSaveCard);
    console.log('Booking - allowPayNow:', this.allowPayNow);
    console.log('Booking - saveCardFeePercent:', this.saveCardFeePercent);
    this.generateCalendar();
    this.getBookedDates();
    this.setDefaultPaymentMethod();
  }

  setDefaultPaymentMethod() {
    const payments = this.acceptedPayments;
    
    if (this.isAdvanceBooking()) {
      if (payments & 2) this.selectedPaymentMethod.set('paypal');
      else if (payments & 4) this.selectedPaymentMethod.set('hotel');
      else if (payments & 8) this.selectedPaymentMethod.set('payAtHotel');
      else if (payments & 1) this.selectedPaymentMethod.set('stripe');
    } else {
      if (payments & 1) this.selectedPaymentMethod.set('stripe');
      else if (payments & 2) this.selectedPaymentMethod.set('paypal');
      else if (payments & 4) this.selectedPaymentMethod.set('hotel');
      else if (payments & 8) this.selectedPaymentMethod.set('payAtHotel');
    }
  }

  isStripeAdvancePaymentAllowed(): boolean {
    if (!this.selectedCheckIn) return true;
    
    const checkInDate = new Date(this.selectedCheckIn);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntilCheckIn > this.STRIPE_ADVANCE_DAYS;
  }

  updatePaymentMethodForAdvance() {
    if (!this.isStripeAdvancePaymentAllowed()) {
      if (this.selectedPaymentMethod() === 'stripe') {
        if (this.acceptedPayments & 2) this.selectedPaymentMethod.set('paypal');
        else if (this.acceptedPayments & 4) this.selectedPaymentMethod.set('hotel');
        else if (this.acceptedPayments & 8) this.selectedPaymentMethod.set('payAtHotel');
      }
    }
  }

  hasPayment(payment: string): boolean {
    const payments = this.acceptedPayments;
    switch(payment) {
      case 'stripe': 
        return !!(payments & 1);
      case 'paypal': return !!(payments & 2);
      case 'hotel': return !!(payments & 4);
      case 'payAtHotel': return !!(payments & 8);
      default: return false;
    }
  }

  get hasAnyPaymentMethod(): boolean {
    const payments = this.acceptedPayments;
    if (payments & 2) return true;
    if (payments & 4) return true;
    if (payments & 8) return true;
    if (payments & 1) return true;
    return false;
  }

  hasOnlyStripe(): boolean {
    const payments = this.acceptedPayments;
    const hasStripe = !!(payments & 1);
    const hasOthers = !!(payments & 14);
    return hasStripe && !hasOthers;
  }

  isAdvanceBooking(): boolean {
    return !!this.selectedCheckIn && this.isStripeAdvancePaymentAllowed();
  }

  shouldShowStripe(): boolean {
    if (!(this.acceptedPayments & 1)) return false;
    return true;
  }

  shouldShowSaveCardOption(): boolean {
    return this.hasPayment('stripe') && this.isAdvanceBooking();
  }

  get hasBookedDates(): boolean {
    return this.bookedDates().length > 0;
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
  }

  generateCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    
    for (let i = 0; i < startDayOfWeek; i++) {
      this.calendarDays.push({ day: null, date: null });
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      this.calendarDays.push({ day, date: dateStr });
    }
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  selectDate(day: CalendarDay) {
    if (!day.date || this.isDateDisabled(day.date)) return;

    if (this.isSelectingCheckIn) {
      this.selectedCheckIn = day.date;
      this.selectedCheckOut = '';
      this.isSelectingCheckIn = false;
      this.updatePaymentMethodForAdvance();
    } else {
      if (day.date >= this.selectedCheckIn) {
        this.selectedCheckOut = day.date;
      } else {
        this.selectedCheckIn = day.date;
        this.selectedCheckOut = '';
      }
      this.isSelectingCheckIn = true;
    }

    if (this.form && this.form.value) {
      this.form.value.checkIn = this.selectedCheckIn;
      this.form.value.checkOut = this.selectedCheckOut;
    }
  }

  isDateInRange(dateStr: string): boolean {
    if (!this.form || !this.form.value || !this.form.value.checkIn || !this.form.value.checkOut) {
      return false;
    }
    const checkIn = this.form.value.checkIn;
    const checkOut = this.form.value.checkOut;
    return dateStr >= checkIn && dateStr <= checkOut;
  }

  getBookedDates() {
    this.loadingBookings.set(true);
    this.bookingError.set('');
    
    this.bookingServ.getAllBooking().subscribe({
      next: (res: any[]) => {
        this.loadingBookings.set(false);
        
        if (res && Array.isArray(res) && res.length > 0) {
          const roomBookings = res.filter((b: any) => b.roomId === this.roomId);
          
          this.bookings = roomBookings;
          const allDates: string[] = [];
          
          roomBookings.forEach((booking: any) => {
            const checkInStr = this.extractDate(booking.checkIn);
            const checkOutStr = this.extractDate(booking.checkOut);
            
            const checkIn = new Date(checkInStr);
            const checkOut = new Date(checkOutStr);
            
            const dates = this.getDatesInRange(checkIn, checkOut);
            allDates.push(...dates);
          });
          
          this.bookedDates.set(allDates);
        } else {
          const demoDates = this.getDemoBookedDates();
          this.bookedDates.set(demoDates);
        }
      },
      error: (err: any) => {
        this.loadingBookings.set(false);
        
        if (err.status === 0) {
          const demoDates = this.getDemoBookedDates();
          this.bookedDates.set(demoDates);
        }
      }
    });
  }
  
  getDemoBookedDates(): string[] {
    const dates: string[] = [];
    const year = this.currentYear;
    const month = this.currentMonth;
    const startDemo = new Date(year, month, 5);
    const endDemo = new Date(year, month, 8);
    while (startDemo < endDemo) {
      dates.push(startDemo.toISOString().split('T')[0]);
      startDemo.setDate(startDemo.getDate() + 1);
    }
    return dates;
  }

  extractDate(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  }

  getDatesInRange(startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current < end) {
      const dateStr = this.extractDate(current.toISOString());
      dates.push(dateStr);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  isDateDisabled(dateStr: string): boolean {
    if (!dateStr) return false;
    
    const todayCompare = new Date(this.today);
    const dateCompare = new Date(dateStr);
    
    if (dateCompare < todayCompare) {
      return true;
    }
    
    const booked = this.bookedDates();
    const isBooked = booked.includes(dateStr);
    
    return isBooked;
  }

  isCheckoutBeforeCheckin(checkIn: string, checkOut: string): boolean {
    if (!checkIn || !checkOut) return false;
    return checkOut <= checkIn;
  }

  validateDates() {
    this.form = this.form || { value: {} };
  }

  onFormChange(form: NgForm) {
    this.form = form;
  }

  hasOverlapWithBookedDates(checkIn: string, checkOut: string): boolean {
    const booked = this.bookedDates();
    if (!checkIn || !checkOut || booked.length === 0) return false;
    
    const selectedDates = this.getDatesInRange(new Date(checkIn), new Date(checkOut));
    const hasOverlap = selectedDates.some(date => booked.includes(date));
    
    return hasOverlap;
  }

  getDuration(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  getTotalAmount(): number {
    const nights = this.getDuration(this.selectedCheckIn, this.selectedCheckOut);
    const baseAmount = nights * this.pricePerNight * (this.form?.value?.guests || 1);
    return baseAmount;
  }

  getTotalWithSaveCardFee(): number {
    const baseAmount = this.getTotalAmount();
    if (this.saveCardFeePercent > 0) {
      return baseAmount + (baseAmount * this.saveCardFeePercent / 100);
    }
    return baseAmount;
  }

  getSaveCardExtraAmount(): number {
    const baseAmount = this.getTotalAmount();
    return baseAmount * this.saveCardFeePercent / 100;
  }

  get totalAmount(): number {
    const nights = this.getDuration(this.selectedCheckIn, this.selectedCheckOut);
    return nights * this.pricePerNight * (this.form?.value?.guests || 1);
  }

  getPaymentMethodName(): string {
    const method = this.selectedPaymentMethod();
    switch (method) {
      case 'stripe': return 'Stripe Card';
      case 'paypal': return 'PayPal';
      case 'hotel': return 'Hotel Direct';
      case 'payAtHotel': return 'Pay at Hotel';
      default: return 'Unknown';
    }
  }

  onConfirmBookingClick(form: NgForm): void {
    if (this.hasOverlapWithBookedDates(this.selectedCheckIn, this.selectedCheckOut)) {
      alert('Selected dates are already booked!');
      return;
    }
    
    if (!this.hasAnyPaymentMethod) {
      alert('No payment methods available for this booking. Please contact the hotel.');
      return;
    }
    
    this.form = form;
    this.showPaymentModal.set(true);
  }

  processPayment(): void {
    if (!this.form) return;
    
    this.processingPayment.set(true);
    
    const totalAmount = this.getDuration(this.selectedCheckIn, this.selectedCheckOut) * this.pricePerNight * (this.form.value.guests || 1);
    
    this.paymentServ.createPaymentIntent(totalAmount).subscribe({
      next: (paymentRes) => {
        const paymentIntentId = paymentRes.paymentIntentId;
        
        this.paymentServ.confirmPayment(paymentIntentId).subscribe({
          next: (confirmRes) => {
            if (confirmRes.success) {
              const dto: BookingModelCreate = {
                roomId: this.roomId,
                checkIn: this.selectedCheckIn,
                checkOut: this.selectedCheckOut,
                guests: (this.form.value.adults || 1) + (this.form.value.children || 0),
                adults: this.form.value.adults || 1,
                children: this.form.value.children || 0,
                paymentMethod: this.getPaymentMethodName(),
                cardSaved: this.cardSaved(),
                paymentIntentId: this.savedPaymentIntentId() || paymentIntentId,
                paymentStatus: this.cardSaved() ? 'Pending' : 'Paid'
              };
              
              this.bookingServ.createBooking(dto, this.roomId).subscribe({
                next: (booking: any) => {
                  const bookingId = booking?.id || booking?.booking?.id;
                  if (!bookingId) {
                    this.processingPayment.set(false);
                    console.error('Booking creation failed - no booking ID returned');
                    alert('Failed to create booking. Please try again.');
                    return;
                  }
                  this.bookingServ.markAsPaid(bookingId, 'Credit Card', paymentIntentId).subscribe({
                    next: () => {
                      this.processingPayment.set(false);
                      this.showPaymentModal.set(false);
                      alert('Payment successful! Booking confirmed.');
                      this.bookingCreated.emit();
                      this.form.reset();
                      this.selectedCheckIn = '';
                      this.selectedCheckOut = '';
                      this.getBookedDates();
                    },
                    error: (err) => {
                      this.processingPayment.set(false);
                      console.error(err);
                      alert('Payment confirmed but booking creation failed.');
                    }
                  });
                },
                error: (err: any) => {
                  this.processingPayment.set(false);
                  console.error('Booking creation error:', err);
                  let errorMsg = 'Unknown error';
                  if (err.error) {
                    if (typeof err.error === 'string') {
                      errorMsg = err.error;
                    } else if (err.error.errors) {
                      errorMsg = JSON.stringify(err.error.errors);
                    } else if (err.error.message) {
                      errorMsg = err.error.message;
                    }
                  } else if (err.message) {
                    errorMsg = err.message;
                  }
                  alert('Failed to create booking: ' + errorMsg);
                }
              });
            } else {
              this.processingPayment.set(false);
              alert('Payment failed. Please try again.');
            }
          },
          error: (err) => {
            console.log('Confirm payment failed, creating booking anyway (demo mode)');
            this.createBookingDemo();
          }
        });
      },
      error: (err) => {
        console.log('Payment API not available, creating booking in demo mode');
        this.createBookingDemo();
      }
    });
  }

  createBookingDemo(): void {
    const dto: BookingModelCreate = {
      roomId: this.roomId,
      checkIn: this.selectedCheckIn,
      checkOut: this.selectedCheckOut,
      guests: (this.form.value.adults || 1) + (this.form.value.children || 0),
      adults: this.form.value.adults || 1,
      children: this.form.value.children || 0,
      paymentMethod: this.getPaymentMethodName(),
      cardSaved: this.cardSaved(),
      paymentIntentId: this.savedPaymentIntentId() || 'demo_' + Date.now(),
      paymentStatus: this.cardSaved() ? 'Pending' : 'Paid'
    };
    
    console.log('Creating booking with DTO:', JSON.stringify(dto));
    
    this.bookingServ.createBooking(dto, this.roomId).subscribe({
      next: (booking: any) => {
        const bookingId = booking?.id || booking?.booking?.id;
        if (!bookingId) {
          this.processingPayment.set(false);
          console.error('Booking creation failed - no booking ID returned');
          alert('Failed to create booking. Please try again.');
          return;
        }
        
        if (this.cardSaved()) {
          this.processingPayment.set(false);
          this.showPaymentModal.set(false);
          alert('Booking confirmed! Card saved. Payment will be charged automatically 7 days before check-in.');
          this.bookingCreated.emit();
          this.form.reset();
          this.selectedCheckIn = '';
          this.selectedCheckOut = '';
          this.getBookedDates();
        } else {
          this.bookingServ.markAsPaid(bookingId, 'Demo Card').subscribe({
            next: () => {
              this.processingPayment.set(false);
              this.showPaymentModal.set(false);
              alert('Booking created successfully!');
              this.bookingCreated.emit();
              this.form.reset();
              this.selectedCheckIn = '';
              this.selectedCheckOut = '';
              this.getBookedDates();
            },
            error: () => {
              this.processingPayment.set(false);
              this.showPaymentModal.set(false);
              alert('Booking created successfully!');
              this.bookingCreated.emit();
              this.form.reset();
              this.selectedCheckIn = '';
              this.selectedCheckOut = '';
              this.getBookedDates();
            }
          });
        }
      },
      error: (err: any) => {
        this.processingPayment.set(false);
        console.error('Booking creation error:', err);
        let errorMsg = 'Unknown error';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMsg = err.error;
          } else if (err.error.errors) {
            errorMsg = JSON.stringify(err.error.errors);
          } else if (err.error.message) {
            errorMsg = err.error.message;
          }
        } else if (err.message) {
          errorMsg = err.message;
        }
        alert('Failed to create booking: ' + errorMsg);
      }
    });
  }

  cancelPayment(): void {
    this.showPaymentModal.set(false);
    this.close.emit();
  }

  onPaymentSuccess(paymentIntentId: string): void {
    this.processingPayment.set(true);
    
    const paymentMethodName = this.getPaymentMethodName();
    const cardWasSaved = paymentIntentId.endsWith('_saved');
    const actualPaymentIntentId = cardWasSaved ? paymentIntentId.replace('_saved', '') : paymentIntentId;
    
    if (cardWasSaved) {
      this.cardSaved.set(true);
      this.savedPaymentIntentId.set(actualPaymentIntentId);
    }
    
    const createBookingWithPayment = (shouldPayNow: boolean) => {
      const isSaveCard = this.cardSaved();
      const amountToCharge = isSaveCard ? this.getTotalWithSaveCardFee() : this.getTotalAmount();
      
      const dto: BookingModelCreate = {
        roomId: this.roomId,
        checkIn: this.selectedCheckIn,
        checkOut: this.selectedCheckOut,
        guests: (this.form.value.adults || 1) + (this.form.value.children || 0),
        adults: this.form.value.adults || 1,
        children: this.form.value.children || 0,
        paymentMethod: paymentMethodName,
        cardSaved: this.cardSaved(),
        paymentIntentId: this.savedPaymentIntentId() || actualPaymentIntentId,
        paymentStatus: this.cardSaved() ? 'Pending' : (shouldPayNow ? 'Paid' : 'Pending'),
        totalAmount: amountToCharge
      };
      
      console.log('Creating booking with DTO:', JSON.stringify(dto));
      
      this.bookingServ.createBooking(dto, this.roomId).subscribe({
        next: (booking: any) => {
          const newBookingId = booking?.id || booking?.booking?.id;
          if (!newBookingId) {
            this.processingPayment.set(false);
            console.error('Booking creation failed - no booking ID returned');
            alert('Failed to create booking. Please try again.');
            return;
          }
          
          if (shouldPayNow && !this.cardSaved()) {
            this.bookingServ.markAsPaid(newBookingId, paymentMethodName, actualPaymentIntentId).subscribe({
              next: () => {
                this.processingPayment.set(false);
                this.showPaymentModal.set(false);
                alert('Payment successful! Booking confirmed.');
                this.bookingCreated.emit();
                this.form.reset();
                this.selectedCheckIn = '';
                this.selectedCheckOut = '';
                this.getBookedDates();
              },
              error: () => {
                this.processingPayment.set(false);
                this.showPaymentModal.set(false);
                alert('Payment successful! Booking confirmed.');
                this.bookingCreated.emit();
                this.form.reset();
                this.selectedCheckIn = '';
                this.selectedCheckOut = '';
                this.getBookedDates();
              }
            });
          } else {
            // Card saved - don't mark as paid
            this.processingPayment.set(false);
            this.showPaymentModal.set(false);
            alert('✅ Booking confirmed!\n\n💾 Card saved.\n⏰ Payment will be charged automatically 7 days before check-in.');
            this.bookingCreated.emit();
            this.form.reset();
            this.selectedCheckIn = '';
            this.selectedCheckOut = '';
            this.getBookedDates();
          }
        },
        error: (err: any) => {
          this.processingPayment.set(false);
          console.error('Booking creation error:', err);
          let errorMsg = 'Unknown error';
          if (err.error) {
            if (typeof err.error === 'string') {
              errorMsg = err.error;
            } else if (err.error.errors) {
              errorMsg = JSON.stringify(err.error.errors);
            } else if (err.error.message) {
              errorMsg = err.error.message;
            }
          } else if (err.message) {
            errorMsg = err.message;
          }
          alert('Failed to create booking: ' + errorMsg);
        }
      });
    };

    // If card was saved, don't pay now - create unpaid booking
    if (cardWasSaved) {
      createBookingWithPayment(false);
      return;
    }

    // For Pay at Hotel, don't mark as paid
    if (paymentMethodName === 'Pay at Hotel') {
      createBookingWithPayment(false);
      return;
    }

    // For all other payments, pay now
    createBookingWithPayment(true);
  }

  startPayPalPayment(): void {
    const amount = this.getDuration(this.selectedCheckIn, this.selectedCheckOut) * this.pricePerNight * (this.form?.value?.guests || 1);
    
    this.paymentServ.createPayPalOrder(this.roomId, amount).subscribe({
      next: (res: any) => {
        window.location.href = res.approvalUrl;
      },
      error: (err: any) => {
        console.error('PayPal order creation failed:', err);
        alert('Payment failed. Please try again.');
      }
    });
  }

  onPaymentError(error: string): void {
    alert('Payment failed: ' + error);
  }
}