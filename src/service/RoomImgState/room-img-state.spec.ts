import { TestBed } from '@angular/core/testing';

import { RoomImgState } from './room-img-state';

describe('RoomImgState', () => {
  let service: RoomImgState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomImgState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
