import { Component, Input } from '@angular/core';
import { HotelImageService } from '../../../service/HotelImageService/hotel-image-service';
import { HotelImageStte } from '../../../service/HotelImageStte/hotel-image-stte';
import { FormsModule, NgForm } from '@angular/forms';
import { HotelImageModelRead } from '../../../model/HotelImageModel/hotel-image-model-read';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-image',
  imports: [FormsModule,CommonModule, ],
  templateUrl: './hotel-image.html',
  styleUrl: './hotel-image.css',
})
export class HotelImage {
  @Input() hotelId!:number
  showForm=false;
  toggleForm(){
    this.showForm=!this.showForm
  }
  constructor(private hotImgServ:HotelImageService,public hotImgState:HotelImageStte){}

  createImage(form:NgForm){
    const dto:HotelImageModelRead=form.value
    this.hotImgServ.createImage(dto,this.hotelId).subscribe({
      next:(res:HotelImageModelRead)=>{
      
        this.hotImgState.addImage(res);
        form.reset()
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }

}
