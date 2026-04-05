import { Component, OnInit, signal } from '@angular/core';
import { HotelService } from '../../../service/HotelService/hotel-service';
import { HotelStateService } from '../../../service/HotelStateService/hotel-state-service';
import { NgForm } from '@angular/forms';
import { HotelModelCreate } from '../../../model/HotelModel/hotel-model-create';
import { HotelModelRead } from '../../../model/HotelModel/hotel-model-read';
import { CityService } from '../../../service/CityService/city-service';
import { CityModelRead } from '../../../model/CityModel/city-model-read';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotel-owner-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel-owner-create.html',
  styleUrl: './hotel-owner-create.css',
})
export class HotelOwnerCreate implements OnInit {
  cities = signal<CityModelRead[]>([]);
  selectedCity: CityModelRead | null = null;
  error = signal<string | null>(null);
  showModal = false;

  paymentOptions = [
    { value: 'CreditCard', label: '💳 Credit Card (Stripe)', checked: true },
    { value: 'PayPal', label: '🅿️ PayPal', checked: false },
    { value: 'HotelDirect', label: '🏨 Hotel Direct (Bank Transfer)', checked: false },
    { value: 'PayAtHotel', label: '💵 Pay at Hotel (Cash)', checked: false }
  ];

  allowPayNow = true;
  allowSaveCard = true;
  saveCardFeePercent = 0;
  autoPayDaysBefore = 7;

  constructor(
    private hotelServ: HotelService,
    private hotelState: HotelStateService,
    private cityService: CityService
  ) {}

  ngOnInit() {
    this.cityService.getAllCity().subscribe({
      next: (res) => {
        this.cities.set(res);
      },
      error: (err) => console.error('Failed to load cities:', err)
    });
  }

  openModal() {
    this.showModal = true;
    this.selectedCity = null;
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  onCityChange(event: Event) {
    const cityId = +(event.target as HTMLSelectElement).value;
    const city = this.cities().find(c => c.id === cityId);
    this.selectedCity = city || null;
  }

  getSelectedPayments(): number {
    let value = 0;
    if (this.paymentOptions.find(p => p.value === 'CreditCard')?.checked) value += 1;
    if (this.paymentOptions.find(p => p.value === 'PayPal')?.checked) value += 2;
    if (this.paymentOptions.find(p => p.value === 'HotelDirect')?.checked) value += 4;
    if (this.paymentOptions.find(p => p.value === 'PayAtHotel')?.checked) value += 8;
    return value;
  }

  createHotel(form: NgForm) {
    if (!form.valid || !this.selectedCity) return;

    this.error.set(null);
    const selectedPayments = this.getSelectedPayments();
    
    const dto: any = {
      name: form.value.name,
      description: form.value.description,
      cityId: +form.value.cityId,
      latitude: this.selectedCity.latitude,
      longitude: this.selectedCity.longitude,
      acceptedPayments: selectedPayments,
      allowPayNow: this.allowPayNow,
      allowSaveCard: this.allowSaveCard,
      saveCardFeePercent: this.saveCardFeePercent || 0,
      autoPayDaysBefore: this.autoPayDaysBefore || 7
    };

    this.hotelServ.createHotel(dto).subscribe({
      next: (res: any) => {
        const hotel: HotelModelRead = {
          id: res.id,
          name: res.name,
          description: res.description,
          cityId: res.cityId,
          cityName: res.cityName,
          createdAt: res.createdAt,
          images: res.images || [],
          rating: res.rating || 0
        };
        this.hotelState.addHotel(hotel);
        form.reset();
        this.selectedCity = null;
        this.paymentOptions.forEach(p => p.checked = p.value === 'CreditCard');
        this.allowPayNow = true;
        this.allowSaveCard = true;
        this.saveCardFeePercent = 0;
        this.autoPayDaysBefore = 7;
        this.closeModal();
      },
      error: (err: any) => {
        const msg = err.error?.message || err.message || 'Failed to create hotel';
        console.error('Create hotel error:', err);
        this.error.set(msg);
      }
    });
  }
}
