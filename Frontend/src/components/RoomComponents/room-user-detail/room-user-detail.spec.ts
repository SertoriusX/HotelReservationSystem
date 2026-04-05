import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomUserDetail } from './room-user-detail';

describe('RoomUserDetail', () => {
  let component: RoomUserDetail;
  let fixture: ComponentFixture<RoomUserDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomUserDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomUserDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
