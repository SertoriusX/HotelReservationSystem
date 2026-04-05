import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelImageCard } from './hotel-image-card';

describe('HotelImageCard', () => {
  let component: HotelImageCard;
  let fixture: ComponentFixture<HotelImageCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelImageCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelImageCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
