import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { helpline1097AdminComponent } from './1097-admin.component';

describe('1097AdminComponent', () => {
  let component: helpline1097AdminComponent;
  let fixture: ComponentFixture<helpline1097AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ helpline1097AdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(helpline1097AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
