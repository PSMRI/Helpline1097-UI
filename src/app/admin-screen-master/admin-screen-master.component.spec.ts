import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminScreenMasterComponent } from './admin-screen-master.component';

describe('AdminScreenMasterComponent', () => {
  let component: AdminScreenMasterComponent;
  let fixture: ComponentFixture<AdminScreenMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminScreenMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScreenMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
