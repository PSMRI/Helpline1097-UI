import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EverwellOutboundWorklistComponent } from './everwell-outbound-worklist.component';

describe('EverwellOutboundWorklistComponent', () => {
  let component: EverwellOutboundWorklistComponent;
  let fixture: ComponentFixture<EverwellOutboundWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EverwellOutboundWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EverwellOutboundWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
