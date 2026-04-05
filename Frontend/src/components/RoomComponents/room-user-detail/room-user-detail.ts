import { Component, OnInit, signal, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { RoomService } from '../../../service/RoomService/room-service';
import { ActivatedRoute } from '@angular/router';
import { RoomState } from '../../../service/RoomState/room-state';
import { RoomImageModelRead } from '../../../model/RoomImageModel/room-image-model-read';
import { RoomImageToSeeUser } from '../room-image-to-see-user/room-image-to-see';
import { RoomImgService } from '../../../service/RoomImgSer/room-img-service';
import { Wishlist } from '../../Wishlist/wishlist/wishlist';
import { ReviewComponents } from '../../ReviewComponents/review-components/review-components';
import { BookingComponentCreate } from '../../BookingComponent/booking-component-create/booking-component-create';

@Component({
  selector: 'app-room-user-detail',
  standalone: true,
  imports: [CommonModule,GoogleMapsModule,RoomImageToSeeUser,Wishlist,ReviewComponents,BookingComponentCreate],
  templateUrl: './room-user-detail.html',
  styleUrl: './room-user-detail.css',
})
export class RoomUserDetail implements OnInit {
  images = signal<RoomImageModelRead[]>([]);
  acceptedPayments = 15;
  allowPayNow = true;
  allowSaveCard = true;
  saveCardFeePercent = 0;
  autoPayDaysBefore = 7;
  mapCenter: google.maps.LatLngLiteral = { lat: 40.7128, lng: -74.0060 };
  mapZoom = 14;
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
  };
  distanceToCityCenter: number | null = null;
  cityCenterLocation: google.maps.LatLngLiteral | null = null;
  roomMarkerOptions: google.maps.MarkerOptions = { draggable: false };
  cityMarkerOptions: google.maps.MarkerOptions = { 
    draggable: false,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 12,
      fillColor: '#FF7A00',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 3
    }
  };
  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: '#FF7A00',
    strokeWeight: 3,
    strokeOpacity: 0.8
  };
  showBookingModal = signal(false);

  constructor(
    private roomUserServ: RoomService,
    private router: ActivatedRoute,
    public roomUserState: RoomState,
    private roomImgServ: RoomImgService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
    
    this.router.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getById(+id);
      }
    });
  }

  private parseAcceptedPayments(value: any): number {
    if (!value) return 15;
    
    if (typeof value === 'number') return value;
    
    if (typeof value === 'string') {
      const parts = value.split(',').map(p => p.trim());
      let result = 0;
      for (const part of parts) {
        switch (part) {
          case 'CreditCard': result |= 1; break;
          case 'PayPal': result |= 2; break;
          case 'HotelDirect': result |= 4; break;
          case 'PayAtHotel': result |= 8; break;
        }
      }
      return result || 15;
    }
    
    return 15;
  }

  getById(id: number) {
    this.roomUserServ.getByIdRoom(id).subscribe({
      next: (res: any) => {
        console.log('Room API response:', res);
        console.log('acceptedPayments from API:', res.acceptedPayments);
        this.roomUserState.room.set(res);
        if (res.latitude && res.longitude) {
          this.mapCenter = { lat: res.latitude, lng: res.longitude };
          this.calculateDistanceToCityCenter(res.latitude, res.longitude);
        }
        if (res.cityLatitude && res.cityLongitude) {
          this.cityCenterLocation = { lat: res.cityLatitude, lng: res.cityLongitude };
        }
        this.acceptedPayments = this.parseAcceptedPayments(res.acceptedPayments);
        this.allowPayNow = res.allowPayNow ?? true;
        this.allowSaveCard = res.allowSaveCard ?? true;
        this.saveCardFeePercent = res.saveCardFeePercent ?? 0;
        this.autoPayDaysBefore = res.autoPayDaysBefore ?? 7;
        console.log('Hotel accepted payments:', this.acceptedPayments);
        console.log('Pay options - PayNow:', this.allowPayNow, 'SaveCard:', this.allowSaveCard, 'Fee:', this.saveCardFeePercent);
      },
      error: (err: any) => {
        console.error(err);
      }
    });

    this.roomImgServ.allRoomImg(id).subscribe({
      next: (res) => {
        this.images.set(res);
      },
      error: (err: any) => {
        console.error('Failed to load images:', err);
      }
    });
  }

  calculateDistanceToCityCenter(roomLat: number, roomLng: number) {
    const room = this.roomUserState.room();
    if (room && room.cityLatitude && room.cityLongitude) {
      this.distanceToCityCenter = this.calculateHaversineDistance(
        roomLat, roomLng,
        room.cityLatitude, room.cityLongitude
      );
    }
  }

  calculateHaversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return Math.round(R * c);
  }

  openBookingModal() {
    this.showBookingModal.set(true);
  }

  closeBookingModal() {
    this.showBookingModal.set(false);
  }
}
