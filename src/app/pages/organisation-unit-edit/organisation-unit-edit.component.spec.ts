import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationUnitEditComponent } from './organisation-unit-edit.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from 'src/app/store/reducers';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatMenuModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonToggleModule
} from '@angular/material';

describe('OrganisationUnitEditComponent', () => {
  let component: OrganisationUnitEditComponent;
  let fixture: ComponentFixture<OrganisationUnitEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers, { metaReducers }),
        RouterTestingModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonToggleModule
      ],
      declarations: [OrganisationUnitEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationUnitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
