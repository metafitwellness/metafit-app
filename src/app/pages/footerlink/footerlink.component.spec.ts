import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterlinkComponent } from './footerlink.component';

describe('FooterlinkComponent', () => {
  let component: FooterlinkComponent;
  let fixture: ComponentFixture<FooterlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterlinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
