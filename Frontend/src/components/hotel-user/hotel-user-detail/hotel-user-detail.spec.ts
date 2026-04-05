import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelUserDetail } from './hotel-user-detail';

describe('HotelUserDetail', () => {
  let component: HotelUserDetail;
  let fixture: ComponentFixture<HotelUserDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelUserDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelUserDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
