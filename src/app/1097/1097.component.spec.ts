import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { 1097Component } from './1097.component';

describe('1097Component', () => {
  let component: 1097Component;
  let fixture: ComponentFixture<1097Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 1097Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(1097Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
