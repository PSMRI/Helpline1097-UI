import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminServiceProviderComponent } from './admin-service-provider.component';

describe('AdminServiceProviderComponent', () => {
  let component: AdminServiceProviderComponent;
  let fixture: ComponentFixture<AdminServiceProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminServiceProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
