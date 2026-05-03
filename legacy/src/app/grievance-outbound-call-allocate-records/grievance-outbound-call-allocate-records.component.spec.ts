import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceOutboundCallAllocateRecordsComponent } from './grievance-outbound-call-allocate-records.component';

describe('GrievanceOutboundCallAllocateRecordsComponent', () => {
  let component: GrievanceOutboundCallAllocateRecordsComponent;
  let fixture: ComponentFixture<GrievanceOutboundCallAllocateRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrievanceOutboundCallAllocateRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceOutboundCallAllocateRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
