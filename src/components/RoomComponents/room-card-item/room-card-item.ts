import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-card-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room-card-item.html',
  styleUrl: './room-card-item.css',
})
export class RoomCardItem {
  @Input() room: any;
  @Input() hotelId!: number;
  @Input() checkIn?: string;
  @Input() checkOut?: string;

  constructor(private router: Router) {}

  bookNow() {
    const queryParams: any = {};
    if (this.checkIn) queryParams.checkIn = this.checkIn;
    if (this.checkOut) queryParams.checkOut = this.checkOut;
    
    this.router.navigate(['/room-user-detail', this.room.id], { queryParams });
  }
}
