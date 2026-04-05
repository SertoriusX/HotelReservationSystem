import { Component, Input, OnInit, OnChanges, SimpleChanges, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../../service/WishlistService/wishlist-service';
import { WishlistState } from '../../../service/WishlistState/wishlist-state';
import { WishlishModel } from '../../../model/WishlishModel/wishlish-model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit, OnChanges {
  @Input() roomId!: number;
  isLiked = signal<boolean>(false);

  constructor(
    private wishlistService: WishlistService,
    public wishListState: WishlistState,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadWishlistOnce();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['roomId'] && !changes['roomId'].firstChange) {
      this.updateLikedStatus();
    }
  }

  loadWishlistOnce() {
    if (this.wishListState.wishList().length === 0) {
      this.wishlistService.get().subscribe({
        next: (res) => {
          this.wishListState.setWishList(res);
          this.updateLikedStatus();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load wishlist:', err);
        }
      });
    } else {
      this.updateLikedStatus();
    }
  }

  updateLikedStatus() {
    this.isLiked.set(this.wishListState.wishList().some(w => w.roomId === this.roomId));
    this.cdr.detectChanges();
  }

  toggleWishlist() {
    if (this.isLiked()) {
      this.removeFromWishlist();
    } else {
      this.addToWishlist();
    }
  }

  addToWishlist() {
    this.wishlistService.addWishList(this.roomId).subscribe({
      next: () => {
        this.wishListState.addToWishList({
          roomId: this.roomId,
          imgs: [],
          roomName: '',
          roomPrice: 0,
          hotelName: '',
          createdAt: new Date().toISOString()
        });
        this.isLiked.set(true);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to add to wishlist:', err);
      }
    });
  }

  removeFromWishlist() {
    const wishItem = this.wishListState.wishList().find(w => w.roomId === this.roomId);
    if (wishItem) {
      this.wishlistService.removeWishList(wishItem.roomId).subscribe({
        next: () => {
          this.wishListState.removeFromWishList(this.roomId);
          this.isLiked.set(false);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Failed to remove from wishlist:', err);
        }
      });
    }
  }
}
