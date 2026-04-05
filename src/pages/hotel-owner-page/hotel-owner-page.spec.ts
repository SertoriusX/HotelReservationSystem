import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelOwnerPage } from './hotel-owner-page';

describe('HotelOwnerPage', () => {
  let component: HotelOwnerPage;
  let fixture: ComponentFixture<HotelOwnerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelOwnerPage],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelOwnerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
