import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationUnitDetailsComponent } from './organisation-unit-details.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('OrganisationUnitDetailsComponent', () => {
  let component: OrganisationUnitDetailsComponent;
  let fixture: ComponentFixture<OrganisationUnitDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [OrganisationUnitDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationUnitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
