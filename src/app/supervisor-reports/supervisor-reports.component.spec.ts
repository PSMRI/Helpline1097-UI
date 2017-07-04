import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorReportsComponent } from './supervisor-reports.component';

describe('SupervisorReportsComponent', () => {
  let component: SupervisorReportsComponent;
  let fixture: ComponentFixture<SupervisorReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
