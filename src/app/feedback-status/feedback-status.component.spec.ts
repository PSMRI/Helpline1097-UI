import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackStatusComponent } from './feedback-status.component';

describe('FeedbackStatusComponent', () => {
  let component: FeedbackStatusComponent;
  let fixture: ComponentFixture<FeedbackStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
