import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSmsDialogComponent } from './common-sms-dialog.component';

describe('CommonSmsDialogComponent', () => {
  let component: CommonSmsDialogComponent;
  let fixture: ComponentFixture<CommonSmsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSmsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSmsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
