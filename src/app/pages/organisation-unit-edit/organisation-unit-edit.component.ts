import { Component, OnInit, AfterViewInit, Inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { State } from "src/app/store/reducers";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { OrganisationUnitChildren } from "src/app/models/organisation-unit.model";
import { getSelectedOrgunitChildChildren } from "src/app/store/selectors/organisation-unit.selectors";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { editOrganisationUnitChild } from "src/app/store/actions";
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
  selectedOrgUnit: any;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OrganisationUnitEditComponent>,
    private orgUnitService: OrganisationUnitService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.parentId = this.route.snapshot.params["parentid"];
    this.currentOrgunit = this.data.organisationUnit.id;
    this.orgUnitService
      .getOrgUnitDetails(this.data.organisationUnit.id)
      .subscribe(ouDetails => {
        if (ouDetails) {
          this.parentOrgUnit = ouDetails["parent"];
        }
      });
    this.selectedOrgunitChild$ = this.orgUnitService.getAllOrgunitDetails(
      this.data.organisationUnit.id
    );

    this.selectedOrgunitChild$.subscribe(childInfo => {
      if (childInfo && childInfo["id"]) {
        this.organisationUnit = childInfo;
        this.organisationUnitForm = this.generateForm();
      }
    });
  }

  generateForm() {
    this.orgunitSubscription = this.data.organisationUnit;
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

  saveOrgunit(e) {
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
        this.onCancel(e);
      });
  }

  onCancel(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }
}
