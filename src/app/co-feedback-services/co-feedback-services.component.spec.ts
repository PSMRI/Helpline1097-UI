import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoFeedbackServicesComponent } from './co-feedback-services.component';

describe('CoFeedbackServicesComponent', () => {
  let component: CoFeedbackServicesComponent;
  let fixture: ComponentFixture<CoFeedbackServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoFeedbackServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoFeedbackServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
