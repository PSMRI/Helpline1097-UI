import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorConfigurationsComponent } from './supervisor-configurations.component';

describe('SupervisorConfigurationsComponent', () => {
  let component: SupervisorConfigurationsComponent;
  let fixture: ComponentFixture<SupervisorConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
