import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomImageModelRead } from '../../../model/RoomImageModel/room-image-model-read';

@Component({
  selector: 'app-room-image-to-see-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room-image-to-see.html',
  styleUrl: './room-image-to-see.css',
})
export class RoomImageToSeeUser {
  @Input() set images(value: RoomImageModelRead[]) {
    this.imagesList = value;
    if (value && value.length > 0) {
      const mainImg = value.find(img => img.isMain);
      this.mainImage.set(mainImg ? mainImg.url : value[0].url);
    }
  }
  
  imagesList: RoomImageModelRead[] = [];
  mainImage = signal<string>('');

  selectImage(url: string) {
    this.mainImage.set(url);
  }
}
