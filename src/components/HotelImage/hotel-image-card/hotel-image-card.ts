import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelImageService } from '../../../service/HotelImageService/hotel-image-service';
import { HotelImageStte } from '../../../service/HotelImageStte/hotel-image-stte';
import { HotelImageModelRead } from '../../../model/HotelImageModel/hotel-image-model-read';

@Component({
  selector: 'app-hotel-image-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-image-card.html',
  styleUrl: './hotel-image-card.css',
})
export class HotelImageCard implements OnInit{
  @Input() hotelId!:number;
  constructor(private hotImgServ:HotelImageService,public hotImgState:HotelImageStte){}
ngOnInit(): void {
  this.getImage()
}

getImage(){
  this.hotImgServ.getAllImage().subscribe({
    next:(res)=>{
      const fixed=res.filter(f=>f.hotelId===this.hotelId)
      this.hotImgState.setImage(fixed)
    }
  })

}
deleteImage(id:number){
  this.hotImgServ.deleteImage(id).subscribe({
    next:()=>{
      this.hotImgState.removeImage(id);
    },
    error:(err)=>{
      console.log(err);
}
  })
}
}