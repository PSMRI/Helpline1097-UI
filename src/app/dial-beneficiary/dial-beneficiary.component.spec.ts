import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialBeneficiaryComponent } from './dial-beneficiary.component';

describe('DialBeneficiaryComponent', () => {
  let component: DialBeneficiaryComponent;
  let fixture: ComponentFixture<DialBeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialBeneficiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
