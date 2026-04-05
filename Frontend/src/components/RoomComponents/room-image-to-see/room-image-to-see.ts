import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomImgService } from '../../../service/RoomImgSer/room-img-service';
import { RoomImageModelRead } from '../../../model/RoomImageModel/room-image-model-read';

@Component({
  selector: 'app-room-image-to-see',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room-image-to-see.html',
  styleUrl: './room-image-to-see.css',
})
export class RoomImageToSee {
  @Input() set images(value: RoomImageModelRead[]) {
    this.imagesList = value;
    if (value && value.length > 0) {
      const mainImg = value.find(img => img.isMain);
      this.mainImage.set(mainImg ? mainImg.url : value[0].url);
    }
  }
  
  imagesList: RoomImageModelRead[] = [];
  mainImage = signal<string>('');

  constructor(private roomImgServ: RoomImgService) {}

  selectImage(url: string) {
    this.mainImage.set(url);
  }

  delete(id: number) {
    this.roomImgServ.removeRoomImg(id).subscribe({
      next: () => {
        this.imagesList = this.imagesList.filter((img: RoomImageModelRead) => img.id !== id);
        if (this.imagesList.length > 0) {
          this.mainImage.set(this.imagesList[0].url);
        } else {
          this.mainImage.set('');
        }
      },
      error: (err: any) => {
        console.error('Failed to delete image:', err);
      }
    });
  }
}
