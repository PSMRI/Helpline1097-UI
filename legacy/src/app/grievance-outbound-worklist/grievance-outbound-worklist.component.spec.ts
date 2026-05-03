import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceOutboundWorklistComponent } from './grievance-outbound-worklist.component';

describe('GrievanceOutboundWorklistComponent', () => {
  let component: GrievanceOutboundWorklistComponent;
  let fixture: ComponentFixture<GrievanceOutboundWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrievanceOutboundWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceOutboundWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
