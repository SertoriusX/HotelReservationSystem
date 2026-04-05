import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingComponentCreate } from './booking-component-create';

describe('BookingComponentCreate', () => {
  let component: BookingComponentCreate;
  let fixture: ComponentFixture<BookingComponentCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingComponentCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingComponentCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
