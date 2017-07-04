import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { 1097CoComponent } from './1097-co.component';

describe('1097CoComponent', () => {
  let component: 1097CoComponent;
  let fixture: ComponentFixture<1097CoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 1097CoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(1097CoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
