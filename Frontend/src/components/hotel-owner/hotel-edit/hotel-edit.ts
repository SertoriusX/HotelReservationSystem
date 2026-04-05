import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HotelService } from '../../../service/HotelService/hotel-service';
import { HotelModelUpdate } from '../../../model/HotelModel/hotel-model-update';
import { HotelStateService } from '../../../service/HotelStateService/hotel-state-service';
import { CityService } from '../../../service/CityService/city-service';
import { CityModelRead } from '../../../model/CityModel/city-model-read';

@Component({
  selector: 'app-hotel-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './hotel-edit.html',
  styleUrl: './hotel-edit.css',
})
export class HotelEdit implements OnInit {
  hotel = signal<any>(null);
  cities = signal<CityModelRead[]>([]);
  hotelId!: number;
  loading = signal(true);
  error = signal<string | null>(null);

  allowPayNow = true;
  allowSaveCard = false;
  saveCardFeePercent = 0;
  autoPayDaysBefore = 7;

  constructor(
    private hotelServ: HotelService,
    private hotelState: HotelStateService,
    private cityService: CityService,
    private router: ActivatedRoute,
    private route:Router
  ) {}

  ngOnInit(): void {
    this.cityService.getAllCity().subscribe({
      next: (res) => this.cities.set(res)
    });

    this.router.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.hotelId = +id;
        this.getHotel(+id);
      }
    });
  }

  getHotel(id: number): void {
    this.loading.set(true);
    this.hotelServ.getByIdHotelByOwner(id).subscribe({
      next: (res) => {
        this.hotel.set(res);
        this.allowPayNow = res.allowPayNow ?? true;
        this.allowSaveCard = res.allowSaveCard ?? false;
        this.saveCardFeePercent = res.saveCardFeePercent ?? 0;
        this.autoPayDaysBefore = res.autoPayDaysBefore ?? 7;
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load hotel');
        this.loading.set(false);
      }
    });
  }

  editHotel(form: NgForm) {
    if (!form.valid || !this.hotelId) return;

    const dto: HotelModelUpdate = {
      name: form.value.name,
      description: form.value.description,
      cityId: form.value.cityId,
      allowPayNow: this.allowPayNow,
      allowSaveCard: this.allowSaveCard,
      saveCardFeePercent: this.saveCardFeePercent,
      autoPayDaysBefore: this.autoPayDaysBefore
    };

    this.hotelServ.updateHotel(this.hotelId, dto).subscribe({
      next: (res) => {
        this.hotel.set(res);
        this.hotelState.updHotel(res);
        console.log('Hotel updated, navigating...');
        this.route.navigate(['/dash-owner']);
      },
      error: (err) => {
        console.error('Update error:', err);
        this.error.set(err.message || 'Failed to update hotel');
      }
    });
  }
}