import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelUserCard } from './hotel-user-card';

describe('HotelUserCard', () => {
  let component: HotelUserCard;
  let fixture: ComponentFixture<HotelUserCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelUserCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelUserCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
