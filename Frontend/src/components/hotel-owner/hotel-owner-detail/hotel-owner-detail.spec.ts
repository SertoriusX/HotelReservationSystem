import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelOwnerDetail } from './hotel-owner-detail';

describe('HotelOwnerDetail', () => {
  let component: HotelOwnerDetail;
  let fixture: ComponentFixture<HotelOwnerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelOwnerDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelOwnerDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
