import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomImageToSeeUser } from './room-image-to-see';

describe('RoomImageToSeeUser', () => {
  let component: RoomImageToSeeUser;
  let fixture: ComponentFixture<RoomImageToSeeUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomImageToSeeUser],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomImageToSeeUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
