import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmseditComponent } from './smsedit.component';

describe('SmseditComponent', () => {
  let component: SmseditComponent;
  let fixture: ComponentFixture<SmseditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmseditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmseditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
