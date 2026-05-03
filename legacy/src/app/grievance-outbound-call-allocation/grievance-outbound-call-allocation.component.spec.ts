import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceOutboundCallAllocationComponent } from './grievance-outbound-call-allocation.component';

describe('GrievanceOutboundCallAllocationComponent', () => {
  let component: GrievanceOutboundCallAllocationComponent;
  let fixture: ComponentFixture<GrievanceOutboundCallAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrievanceOutboundCallAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceOutboundCallAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
