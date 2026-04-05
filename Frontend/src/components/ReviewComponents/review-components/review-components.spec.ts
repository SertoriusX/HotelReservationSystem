import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewComponents } from './review-components';

describe('ReviewComponents', () => {
  let component: ReviewComponents;
  let fixture: ComponentFixture<ReviewComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
