import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomImageToSee } from './room-image-to-see';

describe('RoomImageToSee', () => {
  let component: RoomImageToSee;
  let fixture: ComponentFixture<RoomImageToSee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomImageToSee],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomImageToSee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
