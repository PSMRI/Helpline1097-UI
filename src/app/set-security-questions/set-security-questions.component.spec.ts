import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSecurityQuestionsComponent } from './set-security-questions.component';

describe('SetSecurityQuestionsComponent', () => {
  let component: SetSecurityQuestionsComponent;
  let fixture: ComponentFixture<SetSecurityQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetSecurityQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetSecurityQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
