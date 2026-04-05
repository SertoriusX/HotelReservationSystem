import { Routes } from '@angular/router';
import { RegisterPage } from '../pages/register-page/register-page';
import { LoginPage } from '../pages/login-page/login-page';
import { HotelPage } from '../pages/hotel-page/hotel-page';
import { RegisterOwnerPage } from '../pages/register-owner-page/register-owner-page';
import { HotelOwnerPage } from '../pages/hotel-owner-page/hotel-owner-page';
import { HotelOwnerDetail } from '../components/hotel-owner/hotel-owner-detail/hotel-owner-detail';
import { HotelUserDetail } from '../components/hotel-user/hotel-user-detail/hotel-user-detail';
import { RoomDetail } from '../components/RoomComponents/room-detail/room-detail';
import { HotelEdit } from '../components/hotel-owner/hotel-edit/hotel-edit';
import { RoomEdit } from '../components/RoomComponents/room-edit/room-edit';
import { RoomUserDetail } from '../components/RoomComponents/room-user-detail/room-user-detail';
import { WishlistCard } from '../components/Wishlist/wishlist-card/wishlist-card';
import { HomePage } from '../pages/home-page/home-page';
import { BookingsList } from '../components/BookingComponent/bookings-list/bookings-list';

export const routes: Routes = [
        { path: '', component: HomePage },
        { path: 'register-owner', component: RegisterOwnerPage },
        { path: 'register', component: RegisterPage },
        { path: 'login', component: LoginPage },
        { path: 'dash', component: HotelPage },
        { path: 'dash-owner', component: HotelOwnerPage },
        { path: 'hotel-owner/:id', component: HotelOwnerDetail },
        { path: 'hotel-user/:id', component: HotelUserDetail },
        { path: 'room-detail/:id', component: RoomDetail },
        { path: 'hotel-edit/:id', component: HotelEdit },
        { path: 'room-edit/:id', component: RoomEdit },
        { path: 'room-user-detail/:id', component: RoomUserDetail },
        { path: 'wishlist-card', component: WishlistCard },
        {path:"booking-list",component:BookingsList},
        {path:"homapage",component:HomePage}

];
