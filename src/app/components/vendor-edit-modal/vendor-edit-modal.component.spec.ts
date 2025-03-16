import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorEditModalComponent } from './vendor-edit-modal.component';

describe('VendorEditModalComponent', () => {
  let component: VendorEditModalComponent;
  let fixture: ComponentFixture<VendorEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorEditModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
