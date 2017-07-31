import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryHistoryComponent } from './beneficiary-history.component';

describe('BeneficiaryHistoryComponent', () => {
  let component: BeneficiaryHistoryComponent;
  let fixture: ComponentFixture<BeneficiaryHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiaryHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
