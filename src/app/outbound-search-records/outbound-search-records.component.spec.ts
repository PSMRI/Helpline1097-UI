import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundSearchRecordsComponent } from './outbound-search-records.component';

describe('OutboundSearchRecordsComponent', () => {
  let component: OutboundSearchRecordsComponent;
  let fixture: ComponentFixture<OutboundSearchRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundSearchRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundSearchRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
