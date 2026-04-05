import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../components/navbar/navbar';
import { WishlistService } from '../service/WishlistService/wishlist-service';
import { WishlistState } from '../service/WishlistState/wishlist-state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('HotelReservationSystem');

  constructor(
    private wishlistService: WishlistService,
    private wishlistState: WishlistState
  ) {}

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistService.get().subscribe({
      next: (res) => {
        this.wishlistState.setWishList(res);
      },
      error: (err) => {
        console.log('User not logged in or wishlist empty');
      }
    });
  }
}
