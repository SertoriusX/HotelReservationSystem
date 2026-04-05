import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WishlistService } from '../../../service/WishlistService/wishlist-service';
import { WishlistState } from '../../../service/WishlistState/wishlist-state';
import { RoomImgService } from '../../../service/RoomImgSer/room-img-service';
import { RoomImageModelRead } from '../../../model/RoomImageModel/room-image-model-read';

interface WishlistItem {
  roomId: number;
  roomName: string;
  hotelName: string;
  roomPrice: number;
  imgs: RoomImageModelRead[];
}

@Component({
  selector: 'app-wishlist-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-card.html',
  styleUrl: './wishlist-card.css',
})
export class WishlistCard implements OnInit {
  private wishlistService = inject(WishlistService);
  wishListState = inject(WishlistState);
  private router = inject(Router);
  private roomImgService = inject(RoomImgService);

  ngOnInit(): void {
    this.loadWishlist();
  }

  seeMore(id: number) {
    this.router.navigate(['/room-user-detail', id]);
  }

  loadWishlist() {
    this.wishlistService.get().subscribe({
      next: (res) => {
        console.log('Wishlist API response:', res);
        if (res && Array.isArray(res)) {
          const filtered = res.filter(item => item.roomId);
          
          filtered.forEach((item: WishlistItem, index: number) => {
            if (!item.imgs || item.imgs.length === 0) {
              this.roomImgService.allRoomImg(item.roomId).subscribe({
                next: (imgs) => {
                  item.imgs = imgs;
                  this.wishListState.setWishList([...filtered]);
                },
                error: (err) => {
                  console.error('Failed to load room images:', err);
                }
              });
            }
          });
          
          this.wishListState.setWishList(filtered);
        } else {
          this.wishListState.setWishList([]);
        }
      },
      error: (err) => {
        console.error('Failed to load wishlist:', err);
        this.wishListState.setWishList([]);
      }
    });
  }

  deleteFromWishlist(roomId: number) {
    this.wishlistService.removeWishList(roomId).subscribe({
      next: () => {
        this.wishListState.removeFromWishList(roomId);
      },
      error: (err) => {
        console.error('Failed to remove from wishlist:', err);
      }
    }); 
  }

  getMainImage(imgs: RoomImageModelRead[] | undefined): string {
    if (!imgs || imgs.length === 0) return '';
    const mainImg = imgs.find(img => img.isMain);
    const url = mainImg ? mainImg.url : imgs[0].url;
    return url;
  }
}
