import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { RoomService } from '../../../service/RoomService/room-service';
import { RoomState } from '../../../service/RoomState/room-state';
import { RoomModelRead } from '../../../model/RoomModel/room-model-read';
import { RoomModelCreate } from '../../../model/RoomModel/room-model-create';

@Component({
  selector: 'app-room-create',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './room-create.html',
  styleUrls: ['./room-create.css'],
})
export class RoomCreate {

  @Input() hotelId!: number;
  showModal = false;

  mapCenter: google.maps.LatLngLiteral = { lat: 40.7128, lng: -74.0060 };
  mapZoom = 10;
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
  };
  markerPosition: google.maps.LatLngLiteral | null = null;

  error = signal<string | null>(null);
  
  openModal() {
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  constructor(
    private roomServ: RoomService,
    private roomStat: RoomState
  ) {}

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
    }
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.mapCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.markerPosition = this.mapCenter;
        this.mapZoom = 15;
      });
    }
  }

  createRoom(form: NgForm) {
    if (!form.valid) return;

    this.error.set(null);
    const dto: RoomModelCreate = {
      name: form.value.name,
      price: +form.value.price,
      numberOfBedrooms: +form.value.numberOfBedrooms,
      numberOfBeds: +form.value.numberOfBeds,
      capacity: +form.value.capacity,
      type: form.value.type || 'Standard',
      hasKitchen: form.value.hasKitchen || false,
      hasWifi: form.value.hasWifi || false,
      hasAirConditioning: form.value.hasAirConditioning || false,
      hasTv: form.value.hasTv || false,
      isNonSmoking: form.value.isNonSmoking || false,
      hasSwimmingPool: form.value.hasSwimmingPool || false,
      hasBar: form.value.hasBar || false,
      latitude: this.markerPosition ? this.markerPosition.lat : 0,
      longitude: this.markerPosition ? this.markerPosition.lng : 0
    };

    this.roomServ.createRoom(dto, this.hotelId).subscribe({
      next: (res: RoomModelRead) => {
        this.roomStat.addRoom(res);
        form.reset();
        this.markerPosition = null;
        this.closeModal();
      },
      error: (err: any) => {
        const msg = err.error?.message || err.message || 'Failed to create room';
        console.error('Room create error:', err);
        this.error.set(msg);
      }
    });
  }
}