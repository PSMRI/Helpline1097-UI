import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorCampaignStatusComponent } from './supervisor-campaign-status.component';

describe('SupervisorCampaignStatusComponent', () => {
  let component: SupervisorCampaignStatusComponent;
  let fixture: ComponentFixture<SupervisorCampaignStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorCampaignStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorCampaignStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
