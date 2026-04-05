import { TestBed } from '@angular/core/testing';

import { HotelState } from './hotel-state';

describe('HotelState', () => {
  let service: HotelState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
