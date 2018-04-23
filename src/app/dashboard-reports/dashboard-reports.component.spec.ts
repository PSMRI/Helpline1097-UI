import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardReportsComponent } from './dashboard-reports.component';

describe('DashboardReportsComponent', () => {
  let component: DashboardReportsComponent;
  let fixture: ComponentFixture<DashboardReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
