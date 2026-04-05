import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelOwnerCard } from './hotel-owner-card';

describe('HotelOwnerCard', () => {
  let component: HotelOwnerCard;
  let fixture: ComponentFixture<HotelOwnerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelOwnerCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelOwnerCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
