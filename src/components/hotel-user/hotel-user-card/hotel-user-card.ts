import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, SlicePipe, isPlatformBrowser } from '@angular/common';
import { HotelService } from '../../../service/HotelService/hotel-service';
import { HotelStateService } from '../../../service/HotelStateService/hotel-state-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CityService } from '../../../service/CityService/city-service';
import { CityModelRead } from '../../../model/CityModel/city-model-read';

@Component({
  selector: 'app-hotel-user-card',
  imports: [CommonModule,SlicePipe,FormsModule],
  templateUrl: './hotel-user-card.html',
  styleUrl: './hotel-user-card.css',
})
export class HotelUserCard implements OnInit{
  searchText:string=""
  cities: CityModelRead[] = [];
  selectedCityId: number | null = null;
  filterPayNow = false;
  filterSaveCard = false;

  filterRoomTypes: string[] = [];
  filterAmenities: string[] = [];

  roomTypes = ['Standard', 'Deluxe', 'Suite', 'Family'];
  amenities = [
    { key: 'Bar', icon: '🍸' },
    { key: 'WiFi', icon: '📶' },
    { key: 'AC', icon: '❄️' },
    { key: 'Parking', icon: '🅿️' },
    { key: 'NonSmoking', icon: '🚭' },
    { key: 'Pool', icon: '🏊' },
    { key: 'TV', icon: '📺' }
  ];

  constructor(
    private hotelServ:HotelService,
    public hotelState:HotelStateService,
    private router:Router,
    private cityService: CityService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
    this.getObject();
    this.getCities();
  }

  getCities() {
    this.cityService.getAllCity().subscribe({
      next: (res) => this.cities = res
    });
  }

  seeMore(hotelId:number){
      this.router.navigate(["hotel-user",hotelId])
  }

  getObject(){
    this.hotelServ.getAllHotel().subscribe({
      next:(res)=>{
        this.hotelState.setHotel(res)
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
   
  getFilteredHotels(){
    let hotels = this.hotelState.hotels();
    
    if (this.searchText) {
      hotels = hotels.filter((h:any) => 
        h.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    
    if (this.selectedCityId) {
      hotels = hotels.filter((h:any) => h.cityId === this.selectedCityId);
    }
    
    if (this.filterPayNow) {
      hotels = hotels.filter((h:any) => h.allowPayNow);
    }
    
    if (this.filterSaveCard) {
      hotels = hotels.filter((h:any) => h.allowSaveCard);
    }

    if (this.filterRoomTypes.length > 0) {
      hotels = hotels.filter((h:any) => 
        h.rooms && h.rooms.some((r:any) => this.filterRoomTypes.includes(r.roomType))
      );
    }

    if (this.filterAmenities.length > 0) {
      hotels = hotels.filter((h:any) => 
        h.rooms && h.rooms.some((r:any) => 
          r.amenities && r.amenities.some((a:any) => this.filterAmenities.includes(a))
        )
      );
    }
    
    return hotels;
  }

  toggleRoomType(type: string) {
    if (this.filterRoomTypes.includes(type)) {
      this.filterRoomTypes = this.filterRoomTypes.filter(t => t !== type);
    } else {
      this.filterRoomTypes.push(type);
    }
  }

  toggleAmenity(amenity: string) {
    if (this.filterAmenities.includes(amenity)) {
      this.filterAmenities = this.filterAmenities.filter(a => a !== amenity);
    } else {
      this.filterAmenities.push(amenity);
    }
  }
}