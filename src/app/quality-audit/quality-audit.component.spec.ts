import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityAuditComponent } from './quality-audit.component';

describe('QualityAuditComponent', () => {
  let component: QualityAuditComponent;
  let fixture: ComponentFixture<QualityAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
