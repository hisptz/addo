import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OrganisationUnit,
  OrganisationUnitChildren
} from 'src/app/models/organisation-unit.model';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/reducers';
import {
  getSelectedOrganisationUnit,
  getSelectedOrganisationUnitStatus,
  getOrganisationUnitChildren,
  getOrganisationUnitChildrenLoadedState,
  leafOrgunit
} from 'src/app/store/selectors/organisation-unit.selectors';
import { Router, ActivatedRoute } from '@angular/router';
import { deleteOrganisationUnitChild } from 'src/app/store/actions';
import { MatDialog } from '@angular/material';
import { OrganisationUnitDetailsComponent } from '../organisation-unit-details/organisation-unit-details.component';

@Component({
  selector: 'app-organisation-units',
  templateUrl: './organisation-units.component.html',
  styleUrls: ['./organisation-units.component.css']
})
export class OrganisationUnitsComponent implements OnInit {
  selectedOrganisationUnit$: Observable<OrganisationUnit>;
  selectedOrganisationUnitStatus$: Observable<boolean>;
  organisationUnitChildren$: Observable<OrganisationUnitChildren[]>;
  organisationUnitChildrenLoaded$: Observable<boolean>;
  isLeafOrganisation$: Observable<boolean>;

  public year:number = new Date().getFullYear();
  public month:number = new Date().getMonth();

  parentOrgunit: string;
  constructor(
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.parentOrgunit = this.route.snapshot.params['parentid'];
    this.selectedOrganisationUnit$ = this.store.select(
      getSelectedOrganisationUnit
    );
    this.selectedOrganisationUnitStatus$ = this.store.select(
      getSelectedOrganisationUnitStatus
    );
    this.organisationUnitChildren$ = this.store.select(
      getOrganisationUnitChildren
    );
    this.organisationUnitChildrenLoaded$ = this.store.select(
      getOrganisationUnitChildrenLoadedState
    );
    this.isLeafOrganisation$ = this.store.select(leafOrgunit);
  }

  onEditChild(e: { stopPropagation: () => void; }, id: string) {
    e.stopPropagation();
    this.router.navigate([`organisationunit/${this.parentOrgunit}/${id}`]);
  }

  onDeleteChild(e: { stopPropagation: () => void; }, id: string) {
    e.stopPropagation();
    this.store.dispatch(deleteOrganisationUnitChild({ id: id }));
  }

  onOpenDetails(e: { stopPropagation: () => void; }, organisatioUnit: any) {
    e.stopPropagation();
    this.dialog.open(OrganisationUnitDetailsComponent, {
      data: { organisationUnit: organisatioUnit },
      height: 'auto',
      width: '500px'
    });
  }
}
