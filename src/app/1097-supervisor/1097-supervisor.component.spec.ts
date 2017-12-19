import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { helpline1097SupervisorComponent } from './1097-supervisor.component';

describe('1097SupervisorComponent', () => {
  let component: helpline1097SupervisorComponent;
  let fixture: ComponentFixture<helpline1097SupervisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [helpline1097SupervisorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(helpline1097SupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
