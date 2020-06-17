import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationUnitsComponent } from './organisation-units.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from 'src/app/store/reducers';

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
        StoreModule.forRoot(reducers, { metaReducers }),
      ],
      declarations: [OrganisationUnitsComponent],
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
