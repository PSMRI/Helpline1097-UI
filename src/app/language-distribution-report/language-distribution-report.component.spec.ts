import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageDistributionReportComponent } from './language-distribution-report.component';

describe('LanguageDistributionReportComponent', () => {
  let component: LanguageDistributionReportComponent;
  let fixture: ComponentFixture<LanguageDistributionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageDistributionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageDistributionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
