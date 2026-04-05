import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/AuthService/auth-service';
import { HotelService } from '../../service/HotelService/hotel-service';
import { RoomService } from '../../service/RoomService/room-service';
import { BookingService } from '../../service/BookingService/booking-service';
import { CityService } from '../../service/CityService/city-service';
import { HotelModelRead } from '../../model/HotelModel/hotel-model-read';
import { HotelStateService } from '../../service/HotelStateService/hotel-state-service';
import { CityState } from '../../service/CityState/city-state';
import { RoomModelRead } from '../../model/RoomModel/room-model-read';

interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  currentSlide = signal(0);
  featuredHotels: HotelModelRead[] = [];
  allHotels: HotelModelRead[] = [];
  selectedCityId: number | null = null;
  
  // Booking form
  bookingCityId: number | null = null;
  bookingCheckIn: string = '';
  bookingCheckOut: string = '';
  showSearchResults = signal(false);;
  loadingAvailability = signal(false);;
  allRooms: RoomModelRead[] = [];
  allBookings: any[] = [];
  
  slides: CarouselSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
      title: 'Luxury Stays',
      subtitle: 'Discover the finest hotels around the world'
    },
    {
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80',
      title: 'Perfect Getaways',
      subtitle: 'Your dream vacation starts here'
    },
    {
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80',
      title: 'Unforgettable Experiences',
      subtitle: 'Book your next adventure today'
    }
  ];
  
  get today(): string {
    return new Date().toISOString().split('T')[0];
  }
  
  constructor(
    private router: Router, 
    private authService: AuthService,
    private hotelServ: HotelService,
    private roomServ: RoomService,
    private bookingServ: BookingService,
    private cityServ: CityService,
    public hotelState: HotelStateService,
    public cityState: CityState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
    this.loadCities();
    this.loadFeaturedHotels();
    this.loadRooms();
  }

  loadCities() {
    this.cityServ.getAllCity().subscribe({
      next: (res) => {
        this.cityState.setCities(res.map((c: any) => ({ id: c.id, name: c.name })));
      }
    });
  }

  loadRooms() {
    this.roomServ.getAllRoom().subscribe({
      next: (res) => {
        this.allRooms = res;
        this.hotelState.setRooms(res);
      }
    });
  }

  loadFeaturedHotels() {
    this.hotelServ.getAllHotel().subscribe({
      next: (res) => {
        this.allHotels = res;
        this.featuredHotels = res.slice(0, 6);
        this.hotelState.setHotel(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  filterByCity(cityId: number | null) {
    this.selectedCityId = cityId;
    if (cityId === null) {
      this.featuredHotels = this.allHotels;
    } else {
      this.featuredHotels = this.allHotels.filter(h => h.cityId === cityId);
    }
  }

  goToHotel(hotelId: number) {
    this.router.navigate(['/hotel-user', hotelId]);
  }

  nextSlide() {
    this.currentSlide.set((this.currentSlide() + 1) % this.slides.length);
  }

  prevSlide() {
    this.currentSlide.set((this.currentSlide() - 1 + this.slides.length) % this.slides.length);
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
  }

  exploreHotels() {
    this.router.navigate(['/dash']);
  }

  searchHotels() {
    if (!this.bookingCityId || !this.bookingCheckIn || !this.bookingCheckOut) {
      alert('Please complete all fields');
      return;
    }

    if (this.bookingCheckOut <= this.bookingCheckIn) {
      alert('Check-out must be after check-in');
      return;
    }

    this.loadingAvailability.set(true);
    this.showSearchResults.set(true);;

    const selectedCityId = Number(this.bookingCityId);
    const hotelsInCity = this.allHotels.filter(h => Number(h.cityId) === selectedCityId);
    
    if (hotelsInCity.length === 0) {
      this.featuredHotels = this.allHotels;
      this.loadingAvailability.set(false);;
      return;
    }

    if (this.allRooms.length === 0) {
      this.roomServ.getAllRoom().subscribe({
        next: (rooms) => {
          this.allRooms = rooms;
          this.hotelState.setRooms(rooms);
          this.checkAvailability(hotelsInCity);
        },
        error: () => {
          this.loadingAvailability.set(false);
          this.featuredHotels = hotelsInCity;
        }
      });
    } else {
      this.checkAvailability(hotelsInCity);
    }
  }

  checkAvailability(hotelsInCity: any[]) {
    this.bookingServ.getAvailableRooms(this.bookingCheckIn, this.bookingCheckOut).subscribe({
      next: (res) => {
        const availableRoomIds = res.availableRoomIds || [];
        const availableRooms = this.allRooms.filter(r => availableRoomIds.includes(r.id));
        const availableHotelIds = [...new Set(availableRooms.map(r => r.hotelId))];
        this.featuredHotels = hotelsInCity.filter(h => availableHotelIds.includes(h.id));
        this.loadingAvailability.set(false);;
        
        setTimeout(() => {
          const section = document.querySelector('.search-results-section');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      },
      error: (err) => {
        this.featuredHotels = hotelsInCity;
        this.loadingAvailability.set(false);;
      }
    });
  }

  hasAvailableRoom(rooms: RoomModelRead[], checkIn: string, checkOut: string): boolean {
    if (rooms.length === 0) return false;
    
    for (const room of rooms) {
      const roomBookings = this.allBookings.filter(b => 
        Number(b.roomId) === Number(room.id) && 
        b.status !== 'Refunded' &&
        b.status !== 'Cancelled'
      );
      
      // Check if room is available for the selected dates
      const isAvailable = !roomBookings.some(booking => {
        const bookingCheckIn = new Date(booking.checkIn);
        const bookingCheckOut = new Date(booking.checkOut);
        const selectedCheckIn = new Date(checkIn);
        const selectedCheckOut = new Date(checkOut);
        
        // Check for overlap
        return selectedCheckIn < bookingCheckOut && selectedCheckOut > bookingCheckIn;
      });
      
      if (isAvailable) return true;
    }
    
    return false;
  }

  getCityName(cityId: number | null): string {
    if (!cityId) return '';
    const city = this.cityState.cities().find(c => c.id === cityId);
    return city ? city.name : '';
  }

  bookHotel(hotel: HotelModelRead) {
    if (!this.authService.getToken()) {
      alert('Please login to book a room');
      this.router.navigate(['/login']);
      return;
    }
    
    // Store hotel in state so hotel-user-detail can use it directly
    this.hotelState.setHotel([hotel]);
    
    // Also pre-load rooms for this hotel
    const hotelRooms = this.allRooms.filter(r => r.hotelId === hotel.id);
    if (hotelRooms.length > 0) {
      this.hotelState.setRooms(this.allRooms);
    }
    
    console.log('Navigating to hotel with dates:', this.bookingCheckIn, this.bookingCheckOut);
    this.router.navigate(['/hotel-user', hotel.id], {
      queryParams: {
        checkIn: this.bookingCheckIn,
        checkOut: this.bookingCheckOut
      }
    });
  }

  closeSearchResults() {
    this.showSearchResults.set(false);;
    this.bookingCityId = null;
    this.bookingCheckIn = '';
    this.bookingCheckOut = '';
    this.filterByCity(null);
  }

  get isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }
}