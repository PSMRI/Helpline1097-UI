import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerpageComponent } from './innerpage.component';

describe('InnerpageComponent', () => {
  let component: InnerpageComponent;
  let fixture: ComponentFixture<InnerpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
