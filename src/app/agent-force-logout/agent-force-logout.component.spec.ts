import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentForceLogoutComponent } from './agent-force-logout.component';

describe('AgentForceLogoutComponent', () => {
  let component: AgentForceLogoutComponent;
  let fixture: ComponentFixture<AgentForceLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentForceLogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentForceLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
