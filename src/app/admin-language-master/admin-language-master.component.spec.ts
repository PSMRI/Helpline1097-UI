import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLanguageMasterComponent } from './admin-language-master.component';

describe('AdminLanguageMasterComponent', () => {
  let component: AdminLanguageMasterComponent;
  let fixture: ComponentFixture<AdminLanguageMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLanguageMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLanguageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
