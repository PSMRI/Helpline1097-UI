import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { 1097AdminComponent } from './1097-admin.component';

describe('1097AdminComponent', () => {
  let component: 1097AdminComponent;
  let fixture: ComponentFixture<1097AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 1097AdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(1097AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
