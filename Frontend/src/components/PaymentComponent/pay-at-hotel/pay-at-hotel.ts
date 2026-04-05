import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pay-at-hotel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pay-at-hotel.html',
  styleUrl: './pay-at-hotel.css',
})
export class PayAtHotelComponent implements OnInit {
  @Input() amount!: number;
  @Output() paymentSuccess = new EventEmitter<string>();
  @Output() paymentError = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  processing = signal(false);

  constructor() {}

  ngOnInit(): void {}

  handlePayment(): void {
    this.processing.set(true);
    setTimeout(() => {
      const payAtHotelId = 'pay_at_hotel_' + Date.now();
      this.paymentSuccess.emit(payAtHotelId);
      this.processing.set(false);
    }, 500);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
