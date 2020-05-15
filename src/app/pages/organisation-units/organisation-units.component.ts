import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import {
  OrganisationUnit,
  OrganisationUnitChildren,
} from "src/app/models/organisation-unit.model";
import { Fn } from "@iapps/function-analytics";

import { Store } from "@ngrx/store";
import { State } from "src/app/store/reducers";
import {
  getSelectedOrganisationUnit,
  getSelectedOrganisationUnitStatus,
  getOrganisationUnitChildren,
  getOrganisationUnitChildrenLoadedState,
  leafOrgunit,
} from "src/app/store/selectors/organisation-unit.selectors";
import { Router, ActivatedRoute, Params } from "@angular/router";
import {
  deleteOrganisationUnitChild,
  selectOrganisationUnitSuccess,
  clearOrganisationUnitChildren,
} from "src/app/store/actions";
import { MatDialog } from "@angular/material/dialog";
import { OrganisationUnitDetailsComponent } from "../organisation-unit-details/organisation-unit-details.component";
import { getCurrentUser } from "src/app/store/selectors";
import { OrganisationUnitService } from "src/app/services/organisation-unit.service";
import { OrganisationUnitEditComponent } from "../organisation-unit-edit/organisation-unit-edit.component";

@Component({
  selector: "app-organisation-units",
  templateUrl: "./organisation-units.component.html",
  styleUrls: ["./organisation-units.component.css"],
})
export class OrganisationUnitsComponent implements OnInit {
  favoriteSeason: string;
  orgUnitFilterConfig: any;
  periodFilterConfig: any;
  showStatus: boolean = true;
  selectedOrganisationUnit$: Observable<OrganisationUnit>;
  selectedOrganisationUnitStatus$: Observable<boolean>;
  organisationUnitChildren$: Observable<OrganisationUnitChildren[]>;
  organisationUnitChildrenLoaded$: Observable<boolean>;
  isLeafOrganisation$: Observable<boolean>;
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
    if (Fn) {
      Fn.init({
        baseUrl: "../../../api/",
      });
    }
  }
  periodObject: any;
  action: string;
  ngOnInit() {
    this.orgUnitFilterConfig = {
      singleSelection: true,
      showUserOrgUnitSection: false,
      updateOnSelect: true,
      showOrgUnitLevelGroupSection: false,
    };
    this.periodFilterConfig = {
      singleSelection: true,
      emitOnSelection: false,
      updateOnSelect: true,
    };
    this.ngView();
  }
  onPeriodUpdate(periodObject, action) {
    this.periodObject = periodObject;
    this.action = action;

    //get details of orgunit when period is updated
    this.orgUnitService
      .getOrgUnitDetails(this.route.snapshot.params["parentid"])
      .subscribe((ouDetails) => {
        const orgunitData: {} = {
          items: [{ id: ouDetails.id, name: ouDetails.name }],
        };
        this.onOrgUnitUpdate(orgunitData);
      });
  }

  ngView() {
    if (this.route.snapshot.params["parentid"]) {
      this.orgUnitService
        .getOrgUnitDetails(this.route.snapshot.params["parentid"])
        .subscribe((ouDetails) => {
          if (ouDetails) {
            const period = this.periodObject
              ? this.periodObject["items"][0].id
              : "LAST_MONTH";
            this.selectedOrgUnitItems = [];
            this.selectedOrgUnitItems.push(ouDetails);
            this.router.navigate([
              `organisationunit/${this.route.snapshot.params["parentid"]}`,
            ]);
            this.parentOrgunit = this.route.snapshot.params["parentid"];
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
              `/organisationunit/${this.route.snapshot.params["parentid"]}`,
            ]);
            this.selectedOrganisationUnit$ = this.store.select(
              getSelectedOrganisationUnit
            );
          }
        });
    } else {
      this.currentUser$.subscribe((currentUser) => {
        if (currentUser && currentUser["organisationUnits"]) {
          const period = this.periodObject
            ? this.periodObject["items"][0].id
            : "LAST_MONTH";
          this.selectedOrgUnitItems = currentUser["organisationUnits"];
          this.store.dispatch(
            selectOrganisationUnitSuccess({
              dimensions: {
                id: currentUser["organisationUnits"][0].id,
                pe: period,
                name: currentUser["organisationUnits"][0].name,
              },
            })
          );
          this.router.navigate([
            `/organisationunit/${currentUser["organisationUnits"][0].id}`,
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
    const period = this.periodObject
      ? this.periodObject["items"][0].id
      : "LAST_MONTH";
    this.store.dispatch(clearOrganisationUnitChildren());
    if (selectedOrganisationUnit.id !== "USER_ORGUNIT") {
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
  }

  onEditChild(e, organisatioUnit) {
    e.stopPropagation();
    this.dialog.open(OrganisationUnitEditComponent, {
      data: { organisationUnit: organisatioUnit },
      height: "auto",
      width: "auto",
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
      width: "450px",
    });
  }

  fileName = "addos.csv";

  downloadCSV(): void {
    //initialize check for when subscribed to an observable to prevent multiple csv file downloads
    let subscribed = true;

    this.organisationUnitChildren$.subscribe((childrenGot) => {
      //check for when subscribed to an observable
      if (subscribed) {
        const tableHeader = [
          "Name",
          "Owner's Contact",
          "Dispenser's Contact",
          "Code",
          "Village",
          "Ward",
          "District",
          "Region",
        ];
        let csvRows = [];

        csvRows = childrenGot.map((addo) => {
          return [
            addo.name,
            addo.phoneNumber,
            addo.attributeValues[0] ? addo.attributeValues[0].value : "",
            addo.code,
            addo.parent.name,
            addo.parent.parent.name,
            addo.parent.parent.parent.name,
            addo.parent.parent.parent.parent.name,
          ];
        });

        const row = [tableHeader, ...csvRows];
        let csvContent = "data:text/csv;charset=utf-8,";
        row.forEach(function (rowArray) {
          const rowEntry = rowArray.join(",");
          csvContent += rowEntry + "\r\n";
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "addos.csv");
        link.click();
        //unsubscribed from an observable
        subscribed = false;
      }
    });
  }
  showAddoStatus(): void {
    this.showStatus = !this.showStatus;
  }
}
