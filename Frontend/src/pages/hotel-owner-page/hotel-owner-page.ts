import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelOwnerCreate } from '../../components/hotel-owner/hotel-owner-create/hotel-owner-create';
import { HotelOwnerCard } from '../../components/hotel-owner/hotel-owner-card/hotel-owner-card';
import { HotelStateService } from '../../service/HotelStateService/hotel-state-service';

@Component({
  selector: 'app-hotel-owner-page',
  imports: [CommonModule, HotelOwnerCreate, HotelOwnerCard],
  templateUrl: './hotel-owner-page.html',
  styleUrl: './hotel-owner-page.css',
})
export class HotelOwnerPage {
  constructor(public hotelState: HotelStateService) {}
}