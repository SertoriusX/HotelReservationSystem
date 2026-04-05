import { TestBed } from '@angular/core/testing';

import { RoomImgService } from './room-img-service';

describe('RoomImgService', () => {
  let service: RoomImgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomImgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
