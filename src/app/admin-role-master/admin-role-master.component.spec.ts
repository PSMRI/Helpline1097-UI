import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoleMasterComponent } from './admin-role-master.component';

describe('AdminRoleMasterComponent', () => {
  let component: AdminRoleMasterComponent;
  let fixture: ComponentFixture<AdminRoleMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRoleMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRoleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
