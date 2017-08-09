import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundAllocateRecordsComponent } from './outbound-allocate-records.component';

describe('OutboundAllocateRecordsComponent', () => {
  let component: OutboundAllocateRecordsComponent;
  let fixture: ComponentFixture<OutboundAllocateRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundAllocateRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundAllocateRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
