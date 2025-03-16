import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelmodalComponent } from './hotelmodal.component';

describe('HotelmodalComponent', () => {
  let component: HotelmodalComponent;
  let fixture: ComponentFixture<HotelmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
