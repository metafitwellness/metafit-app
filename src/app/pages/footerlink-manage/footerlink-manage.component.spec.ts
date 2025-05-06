import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterlinkManageComponent } from './footerlink-manage.component';

describe('FooterlinkManageComponent', () => {
  let component: FooterlinkManageComponent;
  let fixture: ComponentFixture<FooterlinkManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterlinkManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterlinkManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
