import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPage } from './hotel-page';

describe('HotelPage', () => {
  let component: HotelPage;
  let fixture: ComponentFixture<HotelPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelPage],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
