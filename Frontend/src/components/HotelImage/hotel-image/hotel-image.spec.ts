import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelImage } from './hotel-image';

describe('HotelImage', () => {
  let component: HotelImage;
  let fixture: ComponentFixture<HotelImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelImage],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
