import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EverwellGuidelinesUploadComponent } from './everwell-guidelines-upload.component';

describe('EverwellGuidelinesUploadComponent', () => {
  let component: EverwellGuidelinesUploadComponent;
  let fixture: ComponentFixture<EverwellGuidelinesUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EverwellGuidelinesUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EverwellGuidelinesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
