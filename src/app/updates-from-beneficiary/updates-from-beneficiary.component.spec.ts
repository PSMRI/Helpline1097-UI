import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatesFromBeneficiaryComponent } from './updates-from-beneficiary.component';

describe('UpdatesFromBeneficiaryComponent', () => {
  let component: UpdatesFromBeneficiaryComponent;
  let fixture: ComponentFixture<UpdatesFromBeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatesFromBeneficiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatesFromBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
