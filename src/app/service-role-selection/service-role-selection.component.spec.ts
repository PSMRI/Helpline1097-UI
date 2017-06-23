import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRoleSelectionComponent } from './service-role-selection.component';

describe('ServiceRoleSelectionComponent', () => {
  let component: ServiceRoleSelectionComponent;
  let fixture: ComponentFixture<ServiceRoleSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceRoleSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRoleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
