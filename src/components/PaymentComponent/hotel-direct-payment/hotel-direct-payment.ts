import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../service/PaymentService/payment-service';

@Component({
  selector: 'app-hotel-direct-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel-direct-payment.html',
  styleUrl: './hotel-direct-payment.css',
})
export class HotelDirectPaymentComponent implements OnInit {
  @Input() amount!: number;
  @Input() bookingId!: number;
  @Output() paymentSuccess = new EventEmitter<string>();
  @Output() paymentError = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  loading = signal(false);
  error = signal<string | null>(null);
  paid = signal(false);

  cardNumber = signal('');
  expiryDate = signal('');
  cvv = signal('');
  cardHolderName = signal('');

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {}

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substring(i, i + 4));
    }
    this.cardNumber.set(parts.join(' '));
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.expiryDate.set(value);
  }

  formatCvv(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    this.cvv.set(value.substring(0, 4));
  }

  isValidCardNumber(): boolean {
    const num = this.cardNumber().replace(/\s/g, '');
    return num.length >= 13 && num.length <= 19 && /^\d+$/.test(num);
  }

  isValidExpiry(): boolean {
    const expiry = this.expiryDate();
    if (expiry.length !== 5) return false;
    const [month, year] = expiry.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt('20' + year, 10);
    if (isNaN(monthNum) || isNaN(yearNum)) return false;
    if (monthNum < 1 || monthNum > 12) return false;
    const now = new Date();
    const expiryDate = new Date(yearNum, monthNum - 1);
    return expiryDate > now;
  }

  isValidCvv(): boolean {
    return this.cvv().length >= 3;
  }

  isValidCardholderName(): boolean {
    return this.cardHolderName().trim().length >= 2;
  }

  handlePayment(): void {
    if (!this.isValidCardNumber() || !this.isValidExpiry() || !this.isValidCvv() || !this.isValidCardholderName()) {
      this.error.set('Please fill in all fields correctly');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const paymentData = {
      cardNumber: this.cardNumber().replace(/\s/g, ''),
      expiryDate: this.expiryDate(),
      cvv: this.cvv(),
      cardHolderName: this.cardHolderName()
    };

    this.paymentService.createHotelDirectPayment(this.bookingId, this.amount, paymentData).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.paymentSuccess.emit(res.transactionId || 'hotel_direct_' + Date.now());
        this.paid.set(true);
      },
      error: (err) => {
        console.error('Hotel Direct payment error:', err);
        this.loading.set(false);
        this.error.set('Payment failed. Using demo mode.');
        const demoId = 'demo_hotel_direct_' + Date.now();
        this.paymentSuccess.emit(demoId);
        this.paid.set(true);
      }
    });
  }

  handleDemoPayment() {
    const demoId = 'demo_hotel_direct_' + Date.now();
    this.paymentSuccess.emit(demoId);
    this.paid.set(true);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
