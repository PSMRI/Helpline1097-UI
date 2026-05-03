import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceOutboundCallReallocationComponent } from './grievance-outbound-call-reallocation.component';

describe('GrievanceOutboundCallReallocationComponent', () => {
  let component: GrievanceOutboundCallReallocationComponent;
  let fixture: ComponentFixture<GrievanceOutboundCallReallocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrievanceOutboundCallReallocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceOutboundCallReallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
