import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../../service/HotelService/hotel-service';
import { HotelStateService } from '../../../service/HotelStateService/hotel-state-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-owner-card',
  imports: [CommonModule],
  templateUrl: './hotel-owner-card.html',
  styleUrl: './hotel-owner-card.css',
})
export class HotelOwnerCard implements OnInit {

  constructor(
    private hotelServ: HotelService,
    public hotelState: HotelStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAll()
  }

  seeMore(hotelId: number) {
    this.router.navigate(["/hotel-owner", hotelId])
  }
  editHotel(hotelId: number) {
    this.router.navigate(["/hotel-edit", hotelId])
  }



  getAll(){
    this.hotelServ.getAllHotelByOwner().subscribe({
      next: (res) => {
        this.hotelState.setHotel(res)
      },
      error: (err) => {
        console.error(err);
      }
    })

  }
    deleteHotel(id: number){
    this.hotelServ.deleteHotel(id).subscribe({
      next:()=>{
        this.hotelState.remove(id);
      },
      error:(err)=>{
        console.error(err);
      }
    })
  }
}