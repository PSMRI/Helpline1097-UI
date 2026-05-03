import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintDescriptionDialogComponent } from './complaint-description-dialog.component';

describe('ComplaintDescriptionDialogComponent', () => {
  let component: ComplaintDescriptionDialogComponent;
  let fixture: ComponentFixture<ComplaintDescriptionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintDescriptionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintDescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
