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
import { deleteOrganisationUnitChild } from "src/app/store/actions";
import { MatDialog } from "@angular/material";
import { OrganisationUnitDetailsComponent } from "../organisation-unit-details/organisation-unit-details.component";
import { OrganisationUnitService } from "../../services/organisation-unit.service";
import {map} from 'rxjs/operators';

@Component({
  selector: "app-organisation-units",
  templateUrl: "./organisation-units.component.html",
  styleUrls: ["./organisation-units.component.css"]
})
export class OrganisationUnitsComponent implements OnInit {
  selectedOrganisationUnit$: Observable<OrganisationUnit>;
  selectedOrganisationUnitStatus$: Observable<boolean>;
  organisationUnitChildren$: Observable<OrganisationUnitChildren[]>;
  organisationUnitChildrenLoaded$: Observable<boolean>;
  isLeafOrganisation$: Observable<boolean>;
  enableEdit = false;
  enableEditIndex = null;
  loadedReportingrate = [];

  parentOrgunit: string;
  constructor(
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private Reportservice: OrganisationUnitService
  ) {}

  ngOnInit() {
    this.parentOrgunit = this.route.snapshot.params["parentid"];
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

  this.Reportservice.getReportingRate()
  .pipe(map( reportData => {
      const reportArray = [];
      for (const key in reportData){
        if(reportData.hasOwnProperty(key)){
        reportArray.push({...reportData[key], id: key})
      }
    }
    return reportArray;
  })
  )
  .subscribe(
      reportingRate => {
        console.log(reportingRate[2]);
        this.loadedReportingrate = reportingRate;
      },
      (err: any) => console.log(err),
      () => console.log("Loaded")
    );
  }

  // onEditChild(e, id: string) {
  //   e.stopPropagation();
  //   this.router.navigate([`organisationunit/${this.parentOrgunit}/${id}`]);
  // }

  // onDeleteChild(e, id: string) {
  //   e.stopPropagation();
  //   this.store.dispatch(deleteOrganisationUnitChild({ id: id }));
  // }


  onOpenDetails(e: { stopPropagation: () => void; }, organisatioUnit: any) {
    e.stopPropagation();
    this.dialog.open(OrganisationUnitDetailsComponent, {
      data: { organisationUnit: organisatioUnit },
      height: "450px",
      width: "400px"
    });
  }

  enableEditMethod(e: any, i: any) {
    this.enableEdit = true;
    this.enableEditIndex = i;
  }

  cancel() {
    this.enableEditIndex = null;
  }

  saveSegment(e: any) {
    this.enableEditIndex = null;
  }
}
