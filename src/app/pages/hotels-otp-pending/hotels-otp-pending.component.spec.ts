import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsOtpPendingComponent } from './hotels-otp-pending.component';

describe('HotelsOtpPendingComponent', () => {
  let component: HotelsOtpPendingComponent;
  let fixture: ComponentFixture<HotelsOtpPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelsOtpPendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelsOtpPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
