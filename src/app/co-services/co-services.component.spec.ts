import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoServicesComponent } from './co-services.component';

describe('CoServicesComponent', () => {
  let component: CoServicesComponent;
  let fixture: ComponentFixture<CoServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
