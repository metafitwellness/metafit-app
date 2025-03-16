import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsViewComponent } from './hotels-view.component';

describe('HotelsViewComponent', () => {
  let component: HotelsViewComponent;
  let fixture: ComponentFixture<HotelsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
