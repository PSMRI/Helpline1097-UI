import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { helpline1097Component } from './1097.component';

describe('1097Component', () => {
  let component: helpline1097Component;
  let fixture: ComponentFixture<helpline1097Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [helpline1097Component ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(helpline1097Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
