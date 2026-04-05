import { Component, Input, Output, EventEmitter, OnInit, signal, computed, ElementRef, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { PaymentService } from '../../../service/PaymentService/payment-service';

@Component({
  selector: 'app-stripe-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stripe-payment.html',
  styleUrl: './stripe-payment.css',
})
export class StripePaymentComponent implements OnInit {
  @Input() amount!: number;
  @Input() currency: string = 'usd';
  @Input() allowSaveCard: boolean = true;
  @Input() saveCardFeePercent: number = 0;
  @Input() autoPayDaysBefore: number = 7;
  @Input() isAdvanceBooking: boolean = false;
  @Output() paymentSuccess = new EventEmitter<string>();
  @Output() paymentError = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  @Output() saveCardChanged = new EventEmitter<boolean>();

  @ViewChild('cardElement') cardElementRef!: ElementRef;

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;

  loading = signal(true);
  processing = signal(false);
  error = signal<string | null>(null);

  cardNumber = signal('');
  cardExpiry = signal('');
  cardCvv = signal('');
  cardName = signal('');
  saveCard = signal(false);
  savedPaymentIntentId = signal<string | null>(null);

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.initStripe();
  }

  async initStripe() {
    try {
      this.stripe = await loadStripe('pk_test_51OYG51Kj5zWaz2WJMAWGXJZDrhLd6rtobsKFTHedgFHpLGHpje6h0BbZdiG93pzKeQkosIYsn4ShLDfJOTcarHUh00vs5qteWb');
      
      if (!this.stripe) {
        console.log('Stripe failed to load, using demo mode');
        this.loading.set(false);
        return;
      }

      this.elements = this.stripe.elements();
      this.card = this.elements.create('card', {
        style: {
          base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': { color: '#aab7c4' }
          },
          invalid: { color: '#fa755a', iconColor: '#fa755a' }
        }
      });

      setTimeout(() => {
        if (this.cardElementRef?.nativeElement && this.card) {
          this.card.mount(this.cardElementRef.nativeElement);
        }
        this.loading.set(false);
      }, 100);
    } catch (e) {
      console.log('Error loading Stripe, demo mode:', e);
      this.loading.set(false);
    }
  }

  get amountWithFee(): number {
    if (this.isAdvanceBooking && this.saveCardFeePercent > 0 && this.saveCard()) {
      return this.amount + (this.amount * this.saveCardFeePercent / 100);
    }
    return this.amount;
  }

  onSaveCardChange(): void {
    this.saveCardChanged.emit(this.saveCard());
  }

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
    this.cardExpiry.set(value);
  }

  formatCvv(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    this.cardCvv.set(value.substring(0, 4));
  }

  onCardKeyDown(event: KeyboardEvent): void {
    if (!/\d/.test(event.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }
  }

  onExpiryKeyDown(event: KeyboardEvent): void {
    if (!/\d/.test(event.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }
  }

  onCvvKeyDown(event: KeyboardEvent): void {
    if (!/\d/.test(event.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }
  }

  isValidCardNumber(): boolean {
    const num = this.cardNumber().replace(/\s/g, '');
    return num.length >= 13 && num.length <= 19 && /^\d+$/.test(num);
  }

  isValidExpiry(): boolean {
    const expiry = this.cardExpiry();
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
    return this.cardCvv().length >= 3;
  }

  isValidCardholderName(): boolean {
    return this.cardName().trim().length >= 2;
  }

  handleSaveCard(): void {
    console.log('handleSaveCard called - just saving card, not charging');
    console.log('saveCard:', this.saveCard());
    
    this.processing.set(true);
    this.error.set(null);

    // In demo mode, just save the card info without charging
    const paymentIntentId = 'saved_card_' + Date.now();
    this.savedPaymentIntentId.set(paymentIntentId);
    this.paymentSuccess.emit(paymentIntentId + '_saved');
    this.processing.set(false);
  }

  handlePayment(): void {
    console.log('handlePayment called');
    console.log('cardNumber:', this.cardNumber());
    console.log('cardExpiry:', this.cardExpiry());
    console.log('cardCvv:', this.cardCvv());
    console.log('cardName:', this.cardName());
    console.log('isValidCardNumber:', this.isValidCardNumber());
    console.log('isValidExpiry:', this.isValidExpiry());
    console.log('saveCard:', this.saveCard());
    console.log('amount with fee:', this.amountWithFee);
    
    if (!this.stripe || !this.card || !this.cardElementRef?.nativeElement) {
      console.log('Stripe not available, using demo mode');
      const paymentIntentId = 'demo_payment_intent_' + Date.now();
      
      if (this.saveCard()) {
        this.savedPaymentIntentId.set(paymentIntentId);
        this.paymentSuccess.emit(paymentIntentId + '_saved');
      } else {
        this.paymentSuccess.emit(paymentIntentId);
      }
      return;
    }

    this.processing.set(true);
    this.error.set(null);

    this.paymentService.createPaymentIntent(this.amountWithFee, this.currency).subscribe({
      next: async (paymentRes: any) => {
        const { clientSecret, paymentIntentId } = paymentRes;

        const { paymentIntent, error } = await this.stripe!.confirmCardPayment(clientSecret, {
          payment_method: { 
            card: this.card!,
            billing_details: { name: this.cardName() }
          }
        });

        if (error) {
          this.error.set(error.message || 'Payment failed');
          this.paymentError.emit(error.message || 'Payment failed');
          this.processing.set(false);
        } else if (paymentIntent?.status === 'succeeded') {
          if (this.saveCard()) {
            this.savedPaymentIntentId.set(paymentIntentId);
            this.paymentSuccess.emit(paymentIntentId + '_saved');
          } else {
            this.paymentSuccess.emit(paymentIntentId);
          }
          this.processing.set(false);
        }
      },
      error: (err: any) => {
        console.log('Payment API unavailable, using demo mode');
        const paymentIntentId = 'demo_payment_intent_' + Date.now();
        
        if (this.saveCard()) {
          this.savedPaymentIntentId.set(paymentIntentId);
          this.paymentSuccess.emit(paymentIntentId + '_saved');
        } else {
          this.paymentSuccess.emit(paymentIntentId);
        }
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
