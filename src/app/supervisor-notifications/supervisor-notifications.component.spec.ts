import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorNotificationsComponent } from './supervisor-notifications.component';

describe('SupervisorNotificationsComponent', () => {
  let component: SupervisorNotificationsComponent;
  let fixture: ComponentFixture<SupervisorNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
