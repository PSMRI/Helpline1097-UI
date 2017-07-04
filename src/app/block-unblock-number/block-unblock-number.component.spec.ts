import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockUnblockNumberComponent } from './block-unblock-number.component';

describe('BlockUnblockNumberComponent', () => {
  let component: BlockUnblockNumberComponent;
  let fixture: ComponentFixture<BlockUnblockNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockUnblockNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockUnblockNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
