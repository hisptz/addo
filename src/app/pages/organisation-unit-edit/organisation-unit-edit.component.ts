import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  Inject,
  Optional
} from "@angular/core";
import { Store } from "@ngrx/store";
import { State } from "src/app/store/reducers";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { OrganisationUnitChildren } from "src/app/models/organisation-unit.model";
import {
  getSelectedOrgunitChild,
  getSelectedOrgunitChildChildren
} from "src/app/store/selectors/organisation-unit.selectors";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import {
  editOrganisationUnitChild,
  loadOrganisationUnitChildren,
  selectOrganisationUnitSuccess,
  clearOrganisationUnitChildren
} from "src/app/store/actions";
import { OrganisationUnitService } from "src/app/services/organisation-unit.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-organisation-unit-edit",
  templateUrl: "./organisation-unit-edit.component.html",
  styleUrls: ["./organisation-unit-edit.component.css"]
})
export class OrganisationUnitEditComponent implements OnInit {
  orgunitSubscription: Subscription;
  childSubscription: Subscription;

  selectedOrgunitChild$: Observable<OrganisationUnitChildren>;
  parentId: string;
  currentOrgunit: string;
  organisationUnitForm: FormGroup;
  organisationUnit: OrganisationUnitChildren;
  attributeValuesUpdate: OrganisationUnitChildren;
  selectedOrgUnitItems: Array<any> = [];
  parentOrgUnit: any;
  isUsertriggered: Boolean = false;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    // @Optional() private dialogRef: MatDialogRef<OrganisationUnitEditComponent>,
    private orgUnitService: OrganisationUnitService // @Optional() @Inject(MAT_DIALOG_DATA) public data:OrganisationUnitChildren
  ) {}

  ngOnInit() {
    this.parentId = this.route.snapshot.params["parentid"];

    this.store.dispatch(
      loadOrganisationUnitChildren({
        id: this.route.snapshot.params["parentid"]
      })
    );
    this.currentOrgunit = this.route.snapshot.params["childid"];
    this.orgUnitService
      .getOrgUnitDetails(this.route.snapshot.params["childid"])
      .subscribe(ouDetails => {
        if (ouDetails) {
          this.parentOrgUnit = ouDetails["parent"];
          this.selectedOrgUnitItems = [];
          this.selectedOrgUnitItems.push(ouDetails);
        }
      });
    this.selectedOrgunitChild$ = this.orgUnitService.getAllOrgunitDetails(
      this.route.snapshot.params["childid"]
    );

    this.selectedOrgunitChild$.subscribe(childInfo => {
      if (childInfo && childInfo["id"]) {
        this.organisationUnit = childInfo;
        this.organisationUnitForm = this.generateForm();
      }
    });
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

  generateForm() {
    this.orgunitSubscription = this.selectedOrgunitChild$.subscribe(
      child => (this.organisationUnit = child)
    );
    return this.fb.group({
      name: new FormControl(this.organisationUnit.name, Validators.required),
      shortName: new FormControl(this.organisationUnit.shortName),
      openingDate: new FormControl(
        this.organisationUnit.openingDate,
        Validators.required
      ),
      closedDate: new FormControl(this.organisationUnit.closedDate),
      url: new FormControl(this.organisationUnit.url),
      description: new FormControl(this.organisationUnit.description),
      comments: new FormControl(this.organisationUnit.comment),
      address: new FormControl(this.organisationUnit.address),
      email: new FormControl(this.organisationUnit.email, Validators.email),
      contactPerson: new FormControl(this.organisationUnit.contactPerson),
      code: new FormControl(this.organisationUnit.code),
      phoneNumber: new FormControl(this.organisationUnit.phoneNumber),
      attributeValues: new FormControl(
        this.organisationUnit.attributeValues[0]
          ? this.organisationUnit.attributeValues[0].value
          : []
      )
    });
  }

  editOrgunit(e) {
    e.stopPropagation();
    let attributeValues = [
      {
        value: this.organisationUnitForm.value.attributeValues,
        attribute: {
          name: "Dispenses facility Phone Number",
          id: "NgmZX27k7gf"
        }
      }
    ];
    this.childSubscription = this.store
      .select(getSelectedOrgunitChildChildren(this.currentOrgunit))
      .subscribe(children => {
        const orgunit = {
          ...this.organisationUnitForm.value,
          children: children,
          id: this.currentOrgunit,
          attributeValues: attributeValues,
          parent: {
            id: this.parentOrgUnit.id
          },
          path: this.organisationUnit.path
        };
        this.store.dispatch(editOrganisationUnitChild({ child: orgunit }));
      });
  }

  onCancel(e) {
    e.stopPropagation();
    this.router.navigate([`/organisationunit/${this.parentOrgUnit.id}`]);
  }
}
