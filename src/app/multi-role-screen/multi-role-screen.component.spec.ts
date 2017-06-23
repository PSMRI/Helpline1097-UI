import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiRoleScreenComponent } from './multi-role-screen.component';

describe('MultiRoleScreenComponent', () => {
  let component: MultiRoleScreenComponent;
  let fixture: ComponentFixture<MultiRoleScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiRoleScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiRoleScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
