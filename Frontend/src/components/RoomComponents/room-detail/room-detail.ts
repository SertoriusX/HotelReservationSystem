import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RoomService } from '../../../service/RoomService/room-service';
import { RoomImgService } from '../../../service/RoomImgSer/room-img-service';
import { RoomModelRead } from '../../../model/RoomModel/room-model-read';
import { RoomImageModelRead } from '../../../model/RoomImageModel/room-image-model-read';
import { RoomCreateImage } from '../room-create-image/room-create-image';
import { RoomImageToSee } from '../room-image-to-see/room-image-to-see';
import { BookingComponentCreate } from '../../BookingComponent/booking-component-create/booking-component-create';
import { AuthService } from '../../../service/AuthService/auth-service';
import { ReviewComponents } from '../../ReviewComponents/review-components/review-components';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, RoomCreateImage, RoomImageToSee, BookingComponentCreate, ReviewComponents],
  templateUrl: './room-detail.html',
  styleUrl: './room-detail.css',
})
export class RoomDetail implements OnInit {
  room = signal<RoomModelRead | null>(null);
  roomImages = signal<RoomImageModelRead[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  acceptedPayments = 0;

  constructor(
    private route: ActivatedRoute,
    private roomServ: RoomService,
    private roomImgServ: RoomImgService,
    private authSer: AuthService
  ) {}

  get isOwner(): boolean {
    const role = this.authSer.getRole();
    return role === "OwnerHotel";
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getRoomById(+id);
      }
    });
  }

  getRoomById(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.roomServ.getByIdRoom(id).subscribe({
      next: (res: any) => {
        this.room.set(res);
        if (res.acceptedPayments !== undefined) {
          this.acceptedPayments = typeof res.acceptedPayments === 'string' 
            ? parseInt(res.acceptedPayments) 
            : res.acceptedPayments;
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load room');
        this.loading.set(false);
      }
    });

    this.roomImgServ.allRoomImg(id).subscribe({
      next: (res) => {
        this.roomImages.set(res);
      },
      error: (err) => {
        console.error('Failed to load images:', err);
      }
    });
  }

  onImageCreated(image: RoomImageModelRead) {
    this.roomImages.update(images => [...images, image]);
  }


}