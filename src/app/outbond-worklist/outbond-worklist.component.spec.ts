import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutbondWorklistComponent } from './outbond-worklist.component';

describe('OutbondWorklistComponent', () => {
  let component: OutbondWorklistComponent;
  let fixture: ComponentFixture<OutbondWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutbondWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutbondWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
