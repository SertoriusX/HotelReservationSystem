import { TestBed } from '@angular/core/testing';

import { RoomState } from './room-state';

describe('RoomState', () => {
  let service: RoomState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
