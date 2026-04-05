import { Component } from '@angular/core';
import { HotelUserCard } from '../../components/hotel-user/hotel-user-card/hotel-user-card';

@Component({
  selector: 'app-hotel-page',
  imports: [HotelUserCard],
  templateUrl: './hotel-page.html',
  styleUrl: './hotel-page.css',
})
export class HotelPage {

}
