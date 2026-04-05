import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../service/PaymentService/payment-service';

@Component({
  selector: 'app-paypal-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paypal-payment.html',
  styleUrl: './paypal-payment.css',
})
export class PayPalPaymentComponent implements OnInit {
  @Input() amount!: number;
  @Input() bookingId!: number;
  @Input() currency: string = 'USD';
  @Output() paymentSuccess = new EventEmitter<string>();
  @Output() paymentError = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  loading = signal(false);
  error = signal<string | null>(null);
  paid = signal(false);
  orderId: string | null = null;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {}

  async createOrder() {
    this.loading.set(true);
    this.error.set(null);

    this.paymentService.createPayPalOrder(this.bookingId, this.amount).subscribe({
      next: (res) => {
        this.orderId = res.orderId;
        window.location.href = res.approvalUrl;
      },
      error: (err) => {
        console.error('PayPal order creation failed:', err);
        this.loading.set(false);
        this.error.set('Failed to create PayPal order. Using demo mode.');
      }
    });
  }

  handleDemoPayment() {
    const demoId = 'demo_paypal_' + Date.now();
    this.paymentSuccess.emit(demoId);
    this.paid.set(true);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
