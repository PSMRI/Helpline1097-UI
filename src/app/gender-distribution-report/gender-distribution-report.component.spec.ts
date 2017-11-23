import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderDistributionReportComponent } from './gender-distribution-report.component';

describe('GenderDistributionReportComponent', () => {
  let component: GenderDistributionReportComponent;
  let fixture: ComponentFixture<GenderDistributionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenderDistributionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenderDistributionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
