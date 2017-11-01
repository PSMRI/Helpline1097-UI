import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoAlternateNumberComponent } from './co-alternate-number.component';

describe('CoAlternateNumberComponent', () => {
  let component: CoAlternateNumberComponent;
  let fixture: ComponentFixture<CoAlternateNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoAlternateNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoAlternateNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
