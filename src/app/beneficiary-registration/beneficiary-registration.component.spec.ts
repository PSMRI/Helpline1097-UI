import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryRegistrationComponent } from './beneficiary-registration.component';

describe('BeneficiaryRegistrationComponent', () => {
  let component: BeneficiaryRegistrationComponent;
  let fixture: ComponentFixture<BeneficiaryRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiaryRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
