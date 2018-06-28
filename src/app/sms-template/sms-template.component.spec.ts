import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsTemplateComponent } from './sms-template.component';

describe('SmsTemplateComponent', () => {
  let component: SmsTemplateComponent;
  let fixture: ComponentFixture<SmsTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
