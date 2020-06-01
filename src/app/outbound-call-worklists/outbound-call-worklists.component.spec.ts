import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundCallWorklistsComponent } from './outbound-call-worklists.component';

describe('OutboundCallWorklistsComponent', () => {
  let component: OutboundCallWorklistsComponent;
  let fixture: ComponentFixture<OutboundCallWorklistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundCallWorklistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutboundCallWorklistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
