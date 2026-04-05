import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../../service/RoomService/room-service';
import { RoomState } from '../../../service/RoomState/room-state';
import { HotelStateService } from '../../../service/HotelStateService/hotel-state-service';
import { BookingService } from '../../../service/BookingService/booking-service';
import { RoomCardItem } from '../room-card-item/room-card-item';

@Component({
  selector: 'app-room-user-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RoomCardItem],
  templateUrl: './room-user-card.html',
  styleUrl: './room-user-card.css',
})
export class RoomUserCard implements OnInit {
  @Input() hotelId!: number;
  @Input() hotel: any;
  @Input() checkIn?: string;
  @Input() checkOut?: string;

  selectedTypes: string[] = [];
  selectHasBar = false;
  selectHasWifi = false;
  selectHasAirConditioning = false;
  selectHasFreeParging = false;
  selectIsNonSmoking = false;
  selectHasSwimmingPool = false;
  selectHasTv = false;

  types: string[] = ['Standard', 'Deluxe', 'Suite', 'Family'];

  availableRoomIds = signal<number[]>([]);
  loadingAvailability = signal(false);

  constructor(
    private roomServ: RoomService,
    public roomState: RoomState,
    public hotelState: HotelStateService,
    private bookingServ: BookingService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms() {
    const cachedRooms = this.hotelState.getRoomsByHotel(this.hotelId);
    if (cachedRooms.length > 0) {
      this.roomState.setRoom(cachedRooms);
      this.checkAvailability();
      return;
    }
    
    this.roomServ.getAllRoom().subscribe({
      next: (res) => {
        const filtered = res.filter(r => r.hotelId === this.hotelId);
        this.roomState.setRoom(filtered);
        this.checkAvailability();
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
      }
    });
  }

  checkAvailability() {
    if (!this.checkIn || !this.checkOut) {
      this.availableRoomIds.set([]);
      return;
    }

    this.loadingAvailability.set(true);
    this.bookingServ.getAvailableRooms(this.checkIn, this.checkOut).subscribe({
      next: (res) => {
        this.availableRoomIds.set(res.availableRoomIds || []);
        this.loadingAvailability.set(false);
      },
      error: () => {
        this.loadingAvailability.set(false);
      }
    });
  }

  toggleType(type: string) {
    this.selectedTypes.includes(type)
      ? this.selectedTypes = this.selectedTypes.filter(t => t !== type)
      : this.selectedTypes.push(type);
  }

  toggleBar() { this.selectHasBar = !this.selectHasBar; }
  toggleWifi() { this.selectHasWifi = !this.selectHasWifi; }
  toggleAirConditioning() { this.selectHasAirConditioning = !this.selectHasAirConditioning; }
  toggleFreeParging() { this.selectHasFreeParging = !this.selectHasFreeParging; }
  toggleNonSmoking() { this.selectIsNonSmoking = !this.selectIsNonSmoking; }
  toggleSwimmingPool() { this.selectHasSwimmingPool = !this.selectHasSwimmingPool; }
  toggleHasTv() { this.selectHasTv = !this.selectHasTv; }

  isRoomAvailable(roomId: number): boolean {
    if (!this.checkIn || !this.checkOut) return true;
    return this.availableRoomIds().includes(roomId);
  }

  getFilteredRooms() {
    return this.roomState.rooms().filter((r: any) => {
      const matchesType = this.selectedTypes.length === 0 || this.selectedTypes.includes(r.type);
      const matchesFilters = 
        (!this.selectHasBar || r.hasBar) &&
        (!this.selectHasWifi || r.hasWifi) &&
        (!this.selectHasAirConditioning || r.hasAirConditioning) &&
        (!this.selectIsNonSmoking || r.isNonSmoking) &&
        (!this.selectHasSwimmingPool || r.hasSwimmingPool) &&
        (!this.selectHasTv || r.hasTv);
      
      const isAvailable = !this.checkIn || !this.checkOut || this.availableRoomIds().length === 0 || this.isRoomAvailable(r.id);
      
      return matchesType && matchesFilters && isAvailable;
    });
  }
}
