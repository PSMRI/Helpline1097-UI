import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoInformationServicesComponent } from './co-information-services.component';

describe('CoInformationServicesComponent', () => {
  let component: CoInformationServicesComponent;
  let fixture: ComponentFixture<CoInformationServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoInformationServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoInformationServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
