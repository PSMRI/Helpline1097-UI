import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVersionDetailsComponent } from './view-version-details.component';

describe('ViewVersionDetailsComponent', () => {
  let component: ViewVersionDetailsComponent;
  let fixture: ComponentFixture<ViewVersionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVersionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVersionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
