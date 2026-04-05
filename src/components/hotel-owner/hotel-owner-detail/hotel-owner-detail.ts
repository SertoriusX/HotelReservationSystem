import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HotelService } from '../../../service/HotelService/hotel-service';
import { HotelModelRead } from '../../../model/HotelModel/hotel-model-read';
import { RoomCreate } from '../../RoomComponents/room-create/room-create';
import { RoomCard } from '../../RoomComponents/room-card/room-card';
import { HotelImage } from '../../HotelImage/hotel-image/hotel-image';
import { BookingsList } from '../../BookingComponent/bookings-list/bookings-list';
import { HotelState } from '../../../service/HotelState/hotel-state';

@Component({
  selector: 'app-hotel-owner-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, RoomCreate, RoomCard, HotelImage, BookingsList],
  templateUrl: './hotel-owner-detail.html',
  styleUrls: ['./hotel-owner-detail.css'],
})
export class HotelOwnerDetail implements OnInit {

  loading = computed(() => this.hotelState.hotelState().length === 0);
  error = signal<string | null>(null);
  
  hotelState = inject(HotelState);
  private route = inject(ActivatedRoute);
  private hotelServ = inject(HotelService);

  get hotel(): HotelModelRead | null {
    const hotels = this.hotelState.hotelState();
    if (hotels.length > 0) {
      return hotels[0];
    }
    return null;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getHotelById(+id);
      }
    });
  }

  getHotelById(id: number): void {
    this.error.set(null);
    console.log('Calling API for hotel ID:', id);
    
    this.hotelServ.getByIdHotel(id).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        if (res && res.id) {
          this.hotelState.setHotel([res]);
        } else {
          console.log('No valid hotel in response');
          this.error.set('Hotel not found or invalid response');
        }
      },
      error: (err: any) => {
        console.error('API Error:', err);
        this.error.set('Failed to load hotel. Status: ' + err.status);
      }
    });
  }

  reloadHotel(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getHotelById(+id);
    }
  }

}