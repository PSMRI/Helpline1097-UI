import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorCalltypeReportsComponent } from './supervisor-calltype-reports.component';

describe('SupervisorCalltypeReportsComponent', () => {
  let component: SupervisorCalltypeReportsComponent;
  let fixture: ComponentFixture<SupervisorCalltypeReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorCalltypeReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorCalltypeReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
