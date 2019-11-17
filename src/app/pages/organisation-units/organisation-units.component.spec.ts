import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationUnitsComponent } from './organisation-units.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MatCardModule,
  MatIconModule,
  MatMenuModule,
  MatDialogModule,
  MatProgressBarModule
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from 'src/app/store/reducers';
import { FormsModule } from '@angular/forms';

describe('OrganisationUnitsComponent', () => {
  let component: OrganisationUnitsComponent;
  let fixture: ComponentFixture<OrganisationUnitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatProgressBarModule,
        FormsModule,
        StoreModule.forRoot(reducers, { metaReducers })
      ],
      declarations: [OrganisationUnitsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
