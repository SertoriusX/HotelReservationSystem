import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomUserCard } from './room-user-card';

describe('RoomUserCard', () => {
  let component: RoomUserCard;
  let fixture: ComponentFixture<RoomUserCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomUserCard],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomUserCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
