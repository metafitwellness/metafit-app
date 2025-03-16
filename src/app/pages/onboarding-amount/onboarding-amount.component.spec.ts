import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingAmountComponent } from './onboarding-amount.component';

describe('OnboardingAmountComponent', () => {
  let component: OnboardingAmountComponent;
  let fixture: ComponentFixture<OnboardingAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingAmountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
