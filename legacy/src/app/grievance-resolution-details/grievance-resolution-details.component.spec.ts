import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceResolutionDetailsComponent } from './grievance-resolution-details.component';

describe('GrievanceResolutionDetailsComponent', () => {
  let component: GrievanceResolutionDetailsComponent;
  let fixture: ComponentFixture<GrievanceResolutionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrievanceResolutionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceResolutionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
