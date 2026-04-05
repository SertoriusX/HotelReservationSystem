import { TestBed } from '@angular/core/testing';

import { HotelImageStte } from './hotel-image-stte';

describe('HotelImageStte', () => {
  let service: HotelImageStte;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelImageStte);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
