import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { 104SupervisorComponent } from './104-supervisor.component';

describe('104SupervisorComponent', () => {
  let component: 104SupervisorComponent;
  let fixture: ComponentFixture<104SupervisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 104SupervisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(104SupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
