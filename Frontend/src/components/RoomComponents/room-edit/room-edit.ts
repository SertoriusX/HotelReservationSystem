import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { RoomService } from '../../../service/RoomService/room-service';
import { RoomModelUpdate } from '../../../model/RoomModel/room-model-update';

@Component({
  selector: 'app-room-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './room-edit.html',
  styleUrl: './room-edit.css',
})
export class RoomEdit implements OnInit {
  room = signal<any>(null);
  roomId!: number;
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private roomServ: RoomService,
    private router: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.router.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.roomId = +id;
        this.getRoom(+id);
      }
    });
  }

  getRoom(id: number): void {
    this.loading.set(true);
    this.roomServ.getByIdRoom(id).subscribe({
      next: (res) => {
        this.room.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load room');
        this.loading.set(false);
      }
    });
  }

  editRoom(form: NgForm) {
    if (!form.valid || !this.roomId) return;

    const currentRoom = this.room();
    const dto: RoomModelUpdate = {
      name: form.value.name,
      description: form.value.description,
      price: +form.value.price,
      capacity: +form.value.capacity,
      numberOfBedrooms: +form.value.numberOfBedrooms,
      numberOfBeds: +form.value.numberOfBeds,
      type: form.value.type,
      hasKitchen: form.value.hasKitchen,
      hasWifi: form.value.hasWifi,
      hasAirConditioning: form.value.hasAirConditioning,
      hasTv: form.value.hasTv,
      isNonSmoking: form.value.isNonSmoking,
      hasSwimmingPool: form.value.hasSwimmingPool,
      hasBar: form.value.hasBar
    };

    this.roomServ.updateRoom(this.roomId, dto).subscribe({
      next: (res) => {
        this.room.set(res);
        console.log('Room updated, navigating...');
        this.route.navigate(['/room-detail', this.roomId]);
      },
      error: (err) => {
        console.error('Update error:', err);
        this.error.set(err.message || 'Failed to update room');
      }
    });
  }

  cancel() {
    this.route.navigate(['/room-detail', this.roomId]);
  }
}
