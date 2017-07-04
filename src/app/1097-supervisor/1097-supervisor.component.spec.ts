import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { 1097SupervisorComponent } from './1097-supervisor.component';

describe('1097SupervisorComponent', () => {
  let component: 1097SupervisorComponent;
  let fixture: ComponentFixture<1097SupervisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 1097SupervisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(1097SupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
