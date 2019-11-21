import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
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
  editOrganisationUnitChild
} from "src/app/store/actions";
import { MatDialog } from "@angular/material";
import { OrganisationUnitService } from "../../services/organisation-unit.service";
import {
  getSelectedOrgunitChild,
  getSelectedOrgunitChildChildren
} from "src/app/store/selectors/organisation-unit.selectors";
import {
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-organisation-units",
  templateUrl: "./organisation-units.component.html",
  styleUrls: ["./organisation-units.component.css"]
})
export class OrganisationUnitsComponent implements OnInit, OnDestroy {
  selectedOrganisationUnit$: Observable<OrganisationUnit>;
  selectedOrganisationUnitStatus$: Observable<boolean>;
  organisationUnitChildren$: Observable<OrganisationUnitChildren[]>;
  organisationUnitChildrenLoaded$: Observable<boolean>;
  isLeafOrganisation$: Observable<boolean>;
  enableEdit = false;
  enableEditIndex = null;
  loadedReportingrate = [];
  orgunitSubscription: Subscription;
  childSubscription: Subscription;
  currentOrgunit: string;
  selectedOrgunitChild$: Observable<OrganisationUnitChildren>;
  parentId: string;
  organisationUnitForm: FormGroup;
  organisationUnit: OrganisationUnitChildren;
  date: Date = new Date();
  parentOrgunit: string;
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
  constructor(
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private Reportservice: OrganisationUnitService,
  ) {}

  ngOnDestroy() {
    // this.orgunitSubscription.unsubscribe();
    // if (this.childSubscription) {
    //   this.childSubscription.unsubscribe();
    // }
  }

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
    this.currentOrgunit = this.route.snapshot.params["childid"];
    this.selectedOrgunitChild$ = this.store.select(
      getSelectedOrgunitChild(this.currentOrgunit)
    );
    // this.organisationUnitForm = this.generateForm();

    // this.Reportservice.getOrgunitChildren()
    // .subscribe(
    //   orgUnits =>{
    //     console.log(orgUnits);
    //     this.loadedOrgUnits = orgUnits
    //   }
    // )
  }

  // generateForm() {
  //   this.orgunitSubscription = this.selectedOrgunitChild$.subscribe(
  //     child => (this.organisationUnit = child)
  //   );
  //   return this.fb.group({
  //     name: new FormControl(this.organisationUnit.name, Validators.required),
  //     shortName: new FormControl(this.organisationUnit.shortName),
  //     openingDate: new FormControl(
  //       this.organisationUnit.openingDate,
  //       Validators.required
  //     ),
  //     closedDate: new FormControl(this.organisationUnit.closedDate),
  //     url: new FormControl(this.organisationUnit.url),
  //     description: new FormControl(this.organisationUnit.description),
  //     comments: new FormControl(this.organisationUnit.comment),
  //     address: new FormControl(this.organisationUnit.address),
  //     email: new FormControl(this.organisationUnit.email, Validators.email),
  //     contactPerson: new FormControl(this.organisationUnit.contactPerson),
  //     code: new FormControl(this.organisationUnit.code),
  //     phoneNumber: new FormControl(this.organisationUnit.phoneNumber)
  //   });
  // }

  enableEditMethod(e: any, i: any) {
    this.enableEdit = true;
    this.enableEditIndex = i;
  }

  saveSegment(e) {
    this.childSubscription = this.store
      .select(getSelectedOrgunitChildChildren(this.currentOrgunit))
      .subscribe(children => {
        const orgunit = {
          ...this.organisationUnitForm.value,
          children: children,
          id: this.currentOrgunit,
          parent: {
            id: this.parentId
          },
          path: this.organisationUnit.path
        };
        this.store.dispatch(editOrganisationUnitChild({ child: orgunit }));
      });
  }

  cancel() {
    this.enableEditIndex = null;
  }
  getMonth = this.months[this.date.getMonth()-1];
  getYear = this.date.getFullYear();
}
