import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelOwnerCreate } from './hotel-owner-create';

describe('HotelOwnerCreate', () => {
  let component: HotelOwnerCreate;
  let fixture: ComponentFixture<HotelOwnerCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelOwnerCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelOwnerCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
