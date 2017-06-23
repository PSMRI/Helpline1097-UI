import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoCounsellingServicesComponent } from './co-counselling-services.component';

describe('CoCounsellingServicesComponent', () => {
  let component: CoCounsellingServicesComponent;
  let fixture: ComponentFixture<CoCounsellingServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoCounsellingServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoCounsellingServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
