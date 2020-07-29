import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EverwellAllocateRecordsComponent } from './everwell-allocate-records.component';

describe('EverwellAllocateRecordsComponent', () => {
  let component: EverwellAllocateRecordsComponent;
  let fixture: ComponentFixture<EverwellAllocateRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EverwellAllocateRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EverwellAllocateRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
