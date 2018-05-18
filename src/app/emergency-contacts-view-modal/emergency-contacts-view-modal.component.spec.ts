import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyContactsViewModalComponent } from './emergency-contacts-view-modal.component';

describe('EmergencyContactsViewModalComponent', () => {
  let component: EmergencyContactsViewModalComponent;
  let fixture: ComponentFixture<EmergencyContactsViewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencyContactsViewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyContactsViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
