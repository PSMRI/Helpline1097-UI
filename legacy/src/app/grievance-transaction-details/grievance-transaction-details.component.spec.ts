import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceTransactionDetailsComponent } from './grievance-transaction-details.component';

describe('GrievanceTransactionDetailsComponent', () => {
  let component: GrievanceTransactionDetailsComponent;
  let fixture: ComponentFixture<GrievanceTransactionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrievanceTransactionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
