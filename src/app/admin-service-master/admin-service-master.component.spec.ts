import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminServiceMasterComponent } from './admin-service-master.component';

describe('AdminServiceMasterComponent', () => {
  let component: AdminServiceMasterComponent;
  let fixture: ComponentFixture<AdminServiceMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminServiceMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminServiceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
