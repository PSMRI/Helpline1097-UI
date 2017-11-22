import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallerAgeReportComponent } from './caller-age-report.component';

describe('CallerAgeReportComponent', () => {
  let component: CallerAgeReportComponent;
  let fixture: ComponentFixture<CallerAgeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallerAgeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallerAgeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
