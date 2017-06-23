import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoReferralServicesComponent } from './co-referral-services.component';

describe('CoReferralServicesComponent', () => {
  let component: CoReferralServicesComponent;
  let fixture: ComponentFixture<CoReferralServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoReferralServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoReferralServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
