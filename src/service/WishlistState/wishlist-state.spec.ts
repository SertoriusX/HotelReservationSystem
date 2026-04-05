import { TestBed } from '@angular/core/testing';

import { WishlistState } from './wishlist-state';

describe('WishlistState', () => {
  let service: WishlistState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WishlistState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
