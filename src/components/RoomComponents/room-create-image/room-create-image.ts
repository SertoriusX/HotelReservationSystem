import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RoomImgService } from '../../../service/RoomImgSer/room-img-service';
import { RoomImageModelCreate } from '../../../model/RoomImageModel/room-image-model-create';
import { RoomImageModelRead } from '../../../model/RoomImageModel/room-image-model-read';

@Component({
  selector: 'app-room-create-image',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-create-image.html',
  styleUrl: './room-create-image.css',
})
export class RoomCreateImage {
  @Input() rooimId!: number;
  @Output() imageCreated = new EventEmitter<RoomImageModelRead>();
  isMain = false;

  constructor(private roomImg: RoomImgService) {}

  createImage(form: NgForm) {
    const dto: RoomImageModelCreate = {
      url: form.value.url,
      isMain: this.isMain,
      roomId: this.rooimId
    };

    this.roomImg.createRoomImg(this.rooimId, dto).subscribe({
      next: (res: RoomImageModelRead) => {
        this.imageCreated.emit(res);
        form.reset();
        this.isMain = false;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
