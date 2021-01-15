import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Fn } from '@iapps/function-analytics';
import { SelectionFilterConfig } from '@iapps/ngx-dhis2-selection-filters';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { FilterByPipe } from 'ngx-pipes';
import { Observable } from 'rxjs';
import {
  OrganisationUnit,
  OrganisationUnitChildren,
} from 'src/app/models/organisation-unit.model';
import { OrganisationUnitService } from 'src/app/services/organisation-unit.service';
import {
  clearOrganisationUnitChildren,
  deleteOrganisationUnitChild,
  selectOrganisationUnitSuccess,
} from 'src/app/store/actions';
import { State } from 'src/app/store/reducers';
import { getCurrentUser } from 'src/app/store/selectors';
import {
  getOrganisationUnitChildren,
  getOrganisationUnitChildrenLoadedState,
  getSelectedOrganisationUnit,
  getSelectedOrganisationUnitStatus,
  leafOrgunit,
} from 'src/app/store/selectors/organisation-unit.selectors';
import { TableActionOption } from '../../shared/models';
import { OrganisationUnitDetailsComponent } from '../organisation-unit-details/organisation-unit-details.component';
import { OrganisationUnitEditComponent } from '../organisation-unit-edit/organisation-unit-edit.component';

@Component({
  selector: 'app-organisation-units',
  templateUrl: './organisation-units.component.html',
  styleUrls: ['./organisation-units.component.css'],
  providers: [FilterByPipe],
})
export class OrganisationUnitsComponent implements OnInit {
  showStatus = true;
  selectedOrganisationUnit$: Observable<OrganisationUnit>;
  selectedOrganisationUnitStatus$: Observable<boolean>;
  organisationUnitChildren$: Observable<OrganisationUnitChildren[]>;
  organisationUnitChildrenLoaded$: Observable<boolean>;
  isLeafOrganisation$: Observable<boolean>;
  parentOrgunit: string;
  currentUser$: Observable<any>;
  selectedOrgUnitItems: Array<any> = [];
  searchText = '';
  itemsPerPage = 50;
  p = 1;
  loaded = false
  addos: Array<any> = [];
  reportedFacilities: Array<any> = [];
  getSelections: unknown;
  reportedAddos: any;
  displayColumns: { ids: string[]; entities: { [id: string]: string } };
  tableActionOptions: TableActionOption[];
  dataSelections: any[];
  orgunitchildren: unknown;
  selectionFilterConfig: SelectionFilterConfig = {
    allowStepSelection: true,
    showDynamicDimension: false,
    showDataFilter: false,
    showValidationRuleGroupFilter: false,
    stepSelections: ['ou', 'pe'],
    disablePeriodTypeSelection: true,
    periodFilterConfig: {
      singleSelection: true,
      emitOnSelection: true,
    },
    orgUnitFilterConfig: {
      showUserOrgUnitSection: false,
      singleSelection: true,
      showOrgUnitGroupSection: false,
      showOrgUnitLevelSection: false,
      showOrgUnitLevelGroupSection: false,
    },
  };

  constructor(
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private orgUnitService: OrganisationUnitService
  ) {
    this.currentUser$ = this.store.select(getCurrentUser);
    if (Fn) {
      Fn.init({
        baseUrl: '../../../api/',
      });
    }
  }
  ngOnInit() {
    this.displayColumns = {
      ids: ['name', 'code', 'parent', 'phoneNumber', 'attributeValues'],
      entities: {
        name: 'Name',
        code: 'Code',
        parent: 'Village',
        phoneNumber: "Owner's Contact",
        attributeValues: "Dispenser's Contact",
      },
    };
    this.ngView();
  }
  ngView() {
    if (this.route.snapshot.params['parentid']) {
      this.orgUnitService
        .getOrgUnitDetails(this.route.snapshot.params['parentid'])
        .subscribe((ouDetails) => {
          if (ouDetails) {
            const period = this.getSelections
              ? this.getSelections['items'][0].id
              : 'LAST_MONTH';
            this.selectedOrgUnitItems = [];
            this.selectedOrgUnitItems.push(ouDetails);
            this.router.navigate([
              `organisationunit/${this.route.snapshot.params['parentid']}`,
            ]);
            this.parentOrgunit = this.route.snapshot.params['parentid'];
            this.store.dispatch(
              selectOrganisationUnitSuccess({
                dimensions: {
                  id: ouDetails.id,
                  pe: period,
                  name: ouDetails.name,
                },
              })
            );
            this.router.navigate([
              `/organisationunit/${this.route.snapshot.params['parentid']}`,
            ]);
            this.selectedOrganisationUnit$ = this.store.select(
              getSelectedOrganisationUnit
            );
            this.orgUnitService
              .getReportedFacilities(
                ouDetails.id,
                this.getSelections
                  ? this.getSelections['items'][0].id
                  : 'LAST_MONTH'
              )
              .subscribe((reportedOrgunits) => {
                this.reportedAddos = reportedOrgunits;
              });
          }
        });
    } else {
      this.currentUser$.subscribe((currentUser) => {
        if (currentUser && currentUser['organisationUnits']) {
          const period = this.getSelections
            ? this.getSelections['items'][0].id
            : 'LAST_MONTH';
          this.selectedOrgUnitItems = currentUser['organisationUnits'];
          this.store.dispatch(
            selectOrganisationUnitSuccess({
              dimensions: {
                id: currentUser['organisationUnits'][0].id,
                pe: period,
                name: currentUser['organisationUnits'][0].name,
              },
            })
          );
          this.router.navigate([
            `/organisationunit/${currentUser['organisationUnits'][0].id}`,
          ]);
        }
      });
    }

    this.selectedOrganisationUnitStatus$ = this.store.select(
      getSelectedOrganisationUnitStatus
    );
    this.organisationUnitChildren$ = this.store.select(
      getOrganisationUnitChildren
    );
    this.store.select(getOrganisationUnitChildren).subscribe((children) => {
      this.orgunitchildren = children;
    });
    this.organisationUnitChildrenLoaded$ = this.store.select(
      getOrganisationUnitChildrenLoadedState
    );
    this.isLeafOrganisation$ = this.store.select(leafOrgunit);
  }

  onSelectionFilterUpdate(dataSelections) {
    const periodObject = { dimension: 'pe' };
    const ouObject = { dimension: 'ou' };
    const availablePeriod = _.find(dataSelections, (o) => {
      return _.isMatch(o, periodObject);
    });
    const availableOu = _.find(dataSelections, (o) => {
      return _.isMatch(o, ouObject);
    });
    this.getSelections = availablePeriod;
    const selectedOrganisationUnit = availableOu
      ? availableOu.items[0]
      : { id: 'USER_ORGUNIT' };
    const period = availablePeriod ? availablePeriod.items[0].id : 'LAST_MONTH';
    this.store.dispatch(clearOrganisationUnitChildren());
    if (selectedOrganisationUnit.id !== 'USER_ORGUNIT') {
      this.store.dispatch(
        selectOrganisationUnitSuccess({
          dimensions: {
            id: selectedOrganisationUnit.id,
            pe: period,
            name: selectedOrganisationUnit.name,
          },
        })
      );
      this.router.navigate([
        `/organisationunit/${selectedOrganisationUnit.id}`,
      ]);
    }
    this.orgUnitService
      .getReportedFacilities(
        selectedOrganisationUnit.id,
        availablePeriod ? availablePeriod.items[0].id : 'LAST_MONTH'
      )
      .subscribe((reportedOrgunits) => {
        this.reportedAddos = reportedOrgunits;
        this.loaded = true;
      });
  }

  onEditChild(organisatioUnit) {
    this.dialog.open(OrganisationUnitEditComponent, {
      data: { organisationUnit: organisatioUnit },
      height: 'auto',
      width: 'auto',
    });
  }

  onDeleteChild(e, id: string) {
    e.stopPropagation();
    this.store.dispatch(deleteOrganisationUnitChild({ id: id }));
  }
  onOpenDetails(e, organisatioUnit) {
    e.stopPropagation();
    this.dialog.open(OrganisationUnitDetailsComponent, {
      data: { organisationUnit: organisatioUnit },
      height: '370px',
      width: '450px',
    });
  }

  fileName = 'addos.csv';

  downloadCSV(status): void {
    console.log('Show Status', status);
    // initialize check for when subscribed to an observable to prevent multiple csv file downloads
    let subscribed = true;
    if (status) {
      this.organisationUnitChildren$.subscribe((childrenGot) => {
        // check for when subscribed to an observable
        if (subscribed) {
          const tableHeader = [
            'Name',
            "Owner's Contact",
            "Dispenser's Contact",
            'Code',
            'Village',
            'Ward',
            'District',
            'Region',
          ];
          let csvRows = [];

          csvRows = childrenGot.map((addo) => {
            return [
              addo.name,
              addo.phoneNumber,
              addo.attributeValues[0] ? addo.attributeValues[0].value : '',
              addo.code,
              addo.parent.name,
              addo.parent.parent.name,
              addo.parent.parent.parent.name,
              addo.parent.parent.parent.parent.name,
            ];
          });

          const row = [tableHeader, ...csvRows];
          let csvContent = 'data:text/csv;charset=utf-8,';
          row.forEach(function (rowArray) {
            const rowEntry = rowArray.join(',');
            csvContent += rowEntry + '\r\n';
          });
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', 'addos.csv');
          link.click();
          // unsubscribed from an observable
          subscribed = false;
        }
      });
    }
    if (!status) {
      this.organisationUnitChildren$.subscribe((childrenGot) => {
        // check for when subscribed to an observable
        if (subscribed) {
          const tableHeader = [
            'Name',
            "Owner's Contact",
            "Dispenser's Contact",
            'Code',
            'Village',
            'Ward',
            'District',
            'Region',
          ];
          let csvRows = [];

          csvRows = childrenGot.map((addo) => {
            return [
              addo.name,
              addo.phoneNumber,
              addo.attributeValues[0] ? addo.attributeValues[0].value : '',
              addo.code,
              addo.parent.name,
              addo.parent.parent.name,
              addo.parent.parent.parent.name,
              addo.parent.parent.parent.parent.name,
            ];
          });

          const row = [tableHeader, ...csvRows];
          let csvContent = 'data:text/csv;charset=utf-8,';
          row.forEach(function (rowArray) {
            const rowEntry = rowArray.join(',');
            csvContent += rowEntry + '\r\n';
          });
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', 'addos.csv');
          link.click();
          // unsubscribed from an observable
          subscribed = false;
        }
      });
    }
  }
  onFilterUpdateAction(dataSelections: unknown) {
    this.onSelectionFilterUpdate(dataSelections);
  }
  showAddoStatus() {
    this.showStatus = !this.showStatus;
  }
  onAddos(e) {
    if (e) {
      e.stopPropagation();
    }
    this.searchText = e ? e.target.value.trim() : this.searchText;
  }
  onUpdatePageSize(e) {
    this.itemsPerPage = e;
  }

  onCurrentPageUpdate(e) {
    this.p = e;
  }
}
