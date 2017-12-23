import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { COComponent } from './co.component';

describe('COComponent', () => {
  let component: COComponent;
  let fixture: ComponentFixture<COComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ COComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(COComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
