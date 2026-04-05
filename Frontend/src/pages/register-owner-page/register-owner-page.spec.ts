import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterOwnerPage } from './register-owner-page';

describe('RegisterOwnerPage', () => {
  let component: RegisterOwnerPage;
  let fixture: ComponentFixture<RegisterOwnerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterOwnerPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterOwnerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
