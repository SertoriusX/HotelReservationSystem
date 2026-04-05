import { Injectable, signal } from '@angular/core';
import { WishlishModel } from '../../model/WishlishModel/wishlish-model';

@Injectable({
  providedIn: 'root',
})
export class WishlistState {
  wishList=signal<WishlishModel[]>([]);
  setWishList(wishList: WishlishModel[]) {
    this.wishList.set(wishList);
  }
  addToWishList(wishList: WishlishModel) {
    this.wishList.update((currentList) => [...currentList, wishList]);
}
  removeFromWishList(roomId: number) {
    this.wishList.update((currentList) => currentList.filter(wish => wish.roomId !== roomId));
  }
}