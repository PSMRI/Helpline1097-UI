import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SexualOrientationReportComponent } from './sexual-orientation-report.component';

describe('SexualOrientationReportComponent', () => {
  let component: SexualOrientationReportComponent;
  let fixture: ComponentFixture<SexualOrientationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SexualOrientationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SexualOrientationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
