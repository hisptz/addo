import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import {
  OrganisationUnit,
  OrganisationUnitChildren
} from "src/app/models/organisation-unit.model";
import { Store } from "@ngrx/store";
import { State } from "src/app/store/reducers";
import {
  getSelectedOrganisationUnit,
  getSelectedOrganisationUnitStatus,
  getOrganisationUnitChildren,
  getOrganisationUnitChildrenLoadedState,
  leafOrgunit
} from "src/app/store/selectors/organisation-unit.selectors";
import { Router, ActivatedRoute } from "@angular/router";
import {
  deleteOrganisationUnitChild,
  selectOrganisationUnitSuccess,
  clearOrganisationUnitChildren
} from "src/app/store/actions";
import { MatDialog } from "@angular/material";
import { OrganisationUnitDetailsComponent } from "../organisation-unit-details/organisation-unit-details.component";
import { getCurrentUser } from "src/app/store/selectors";
import { OrganisationUnitService } from "src/app/services/organisation-unit.service";
import { OrganisationUnitEditComponent } from "../organisation-unit-edit/organisation-unit-edit.component";
import * as XLSX from "xlsx";
import * as _ from "lodash";

@Component({
  selector: "app-organisation-units",
  templateUrl: "./organisation-units.component.html",
  styleUrls: ["./organisation-units.component.css"]
})
export class OrganisationUnitsComponent implements OnInit {
  orgUnitFilterConfig = {
    singleSelection: true,
    showUserOrgUnitSection: false,
    updateOnSelect: true,
    showOrgUnitLevelGroupSection: false
  };
  periods = [
    {value: 'January', viewValue: 'January'},
    {value: 'February', viewValue: 'February'},
    {value: 'March', viewValue: 'March'}
  ];  selectedOrganisationUnit$: Observable<OrganisationUnit>;
  selectedOrganisationUnitStatus$: Observable<boolean>;
  organisationUnitChildren$: Observable<OrganisationUnitChildren[]>;
  organisationUnitChildrenLoaded$: Observable<boolean>;
  isLeafOrganisation$: Observable<boolean>;
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  date: Date = new Date();
  parentOrgunit: string;
  currentUser$: Observable<any>;
  selectedOrgUnitItems: Array<any> = [];
  omitcolumn: any;

  constructor(
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private orgUnitService: OrganisationUnitService
  ) {
    this.currentUser$ = this.store.select(getCurrentUser);
  }

  ngOnInit() {
    if (this.route.snapshot.params["parentid"]) {
      this.orgUnitService
        .getOrgUnitDetails(this.route.snapshot.params["parentid"])
        .subscribe(ouDetails => {
          if (ouDetails) {
            this.selectedOrgUnitItems = [];
            this.selectedOrgUnitItems.push(ouDetails);
            this.router.navigate([
              `organisationunit/${this.route.snapshot.params["parentid"]}`
            ]);
            this.parentOrgunit = this.route.snapshot.params["parentid"];
            this.store.dispatch(
              selectOrganisationUnitSuccess({
                organisationUnit: ouDetails
              })
            );
            this.router.navigate([
              `/organisationunit/${this.route.snapshot.params["parentid"]}`
            ]);
            this.selectedOrganisationUnit$ = this.store.select(
              getSelectedOrganisationUnit
            );
          }
        });
    } else {
      this.currentUser$.subscribe(currentUser => {
        if (currentUser && currentUser["organisationUnits"]) {
          this.selectedOrgUnitItems = currentUser["organisationUnits"];
          this.store.dispatch(
            selectOrganisationUnitSuccess({
              organisationUnit: currentUser["organisationUnits"][0]
            })
          );
          this.router.navigate([
            `/organisationunit/${currentUser["organisationUnits"][0].id}`
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
    this.organisationUnitChildrenLoaded$ = this.store.select(
      getOrganisationUnitChildrenLoadedState
    );
    this.isLeafOrganisation$ = this.store.select(leafOrgunit);
  }

  onOrgUnitUpdate(orgunitData) {
    const selectedOrganisationUnit = orgunitData.items[0];
    this.store.dispatch(clearOrganisationUnitChildren());
    if (selectedOrganisationUnit.id !== "USER_ORGUNIT") {
      this.store.dispatch(
        selectOrganisationUnitSuccess({
          organisationUnit: selectedOrganisationUnit
        })
      );
      this.router.navigate([
        `/organisationunit/${selectedOrganisationUnit.id}`
      ]);
    }
  }

  onEditChild(e, organisatioUnit) {
    e.stopPropagation();
    this.dialog.open(OrganisationUnitEditComponent, {
      data: { organisationUnit: organisatioUnit },
      height: "auto",
      width: "auto"
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
      height: "370px",
      width: "450px"
    });
  }
  getMonth = this.months[this.date.getMonth() - 1];
  getYear = this.date.getFullYear();

  fileName = "addos.xlsx";

  downloadCSV(): void {
    this.organisationUnitChildren$.subscribe(childrenGot => {
      const tableHeader = [
        "Name",
        "Contact Person",
        "Dispenser's Contact",
        "Code"
      ];
      let csvRows = [];

      csvRows = childrenGot.map(addo => {
        return [
          addo.name,
          addo.phoneNumber,
          addo.attributeValues[0] ? addo.attributeValues[0].value : "",
          addo.code
        ];
      });
      console.log(csvRows);
      const row = [tableHeader, ...csvRows];
      let csvContent = "data:text/csv;charset=utf-8,";
      row.forEach(function(rowArray) {
        const rowEntry = rowArray.join(",");
        csvContent += rowEntry + "\r\n";
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "addos.csv");
      link.click();
    });
  }
}
