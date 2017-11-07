import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReallocateCallsComponent } from './reallocate-calls.component';

describe('ReallocateCallsComponent', () => {
  let component: ReallocateCallsComponent;
  let fixture: ComponentFixture<ReallocateCallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReallocateCallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReallocateCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
