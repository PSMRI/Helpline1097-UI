import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { helpline1097CoComponent } from './1097-co.component';

describe('1097CoComponent', () => {
  let component: helpline1097CoComponent;
  let fixture: ComponentFixture<helpline1097CoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [helpline1097CoComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(helpline1097CoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
