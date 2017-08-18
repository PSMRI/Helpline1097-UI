import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingResourcesComponent } from './training-resources.component';

describe('TrainingResourcesComponent', () => {
  let component: TrainingResourcesComponent;
  let fixture: ComponentFixture<TrainingResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
