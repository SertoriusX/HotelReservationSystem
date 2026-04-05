import { Component, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../../service/HotelService/hotel-service';
import { HotelModelRead } from '../../../model/HotelModel/hotel-model-read';
import { RoomUserCard } from '../../RoomComponents/room-user-card/room-user-card';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HotelStateService } from '../../../service/HotelStateService/hotel-state-service';

@Component({
  selector: 'app-hotel-user-detail',
  imports: [RoomUserCard, CommonModule],
  templateUrl: './hotel-user-detail.html',
  styleUrl: './hotel-user-detail.css',
})
export class HotelUserDetail implements OnInit{
    hotel = signal<HotelModelRead | null>(null);
    checkIn?: string;
    checkOut?: string;
    errorMessage = '';

  constructor(
    private router:ActivatedRoute,
    private hotelServ:HotelService, 
    public hotelState: HotelStateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
    
    this.router.paramMap.subscribe(params=>{
      const id=params.get("id")
      if (id) {
        const hotelId=Number(id)
        console.log('HotelUserDetail - Loading hotel:', hotelId);
        
        // Try to get hotel from state first
        const cachedHotel = this.hotelState.hotels().find(h => h.id === hotelId);
        if (cachedHotel) {
          console.log('Hotel found in state:', cachedHotel);
          this.hotel.set(cachedHotel);
        } else {
          // Load from API if not in state
          this.getHotelById(hotelId);
        }
      }
    })
    
    // Get dates from query params
    this.router.queryParamMap.subscribe(queryParams => {
      this.checkIn = queryParams.get('checkIn') || undefined;
      this.checkOut = queryParams.get('checkOut') || undefined;
      console.log('HotelUserDetail - Dates from query:', this.checkIn, this.checkOut);
    });
  }

  getHotelById(hotelId:number){
    this.hotelServ.getByIdHotel(hotelId).subscribe({
      next:(res)=>{
        console.log('Hotel loaded successfully:', res);
        this.hotel.set(res);
      },
      error:(err)=>{
        console.error('Error loading hotel:', err);
        this.errorMessage = 'Failed to load hotel. Please check if the backend is running.';
      }
    })
  }
}
