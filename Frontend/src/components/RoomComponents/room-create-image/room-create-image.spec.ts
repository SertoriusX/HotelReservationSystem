import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomCreateImage } from './room-create-image';

describe('RoomCreateImage', () => {
  let component: RoomCreateImage;
  let fixture: ComponentFixture<RoomCreateImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomCreateImage],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomCreateImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
