import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlernateEmailModelComponent } from './alernate-email-model.component';

describe('AlernateEmailModelComponent', () => {
  let component: AlernateEmailModelComponent;
  let fixture: ComponentFixture<AlernateEmailModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlernateEmailModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlernateEmailModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
