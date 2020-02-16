import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { OrganisationUnitChildren } from 'src/app/models/organisation-unit.model';
import {
  getSelectedOrgunitChild,
  getSelectedOrgunitChildChildren
} from 'src/app/store/selectors/organisation-unit.selectors';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { editOrganisationUnitChild } from 'src/app/store/actions';

@Component({
  selector: 'app-organisation-unit-edit',
  templateUrl: './organisation-unit-edit.component.html',
  styleUrls: ['./organisation-unit-edit.component.css']
})
export class OrganisationUnitEditComponent implements OnInit, OnDestroy {
  orgunitSubscription: Subscription;
  childSubscription: Subscription;

  selectedOrgunitChild$: Observable<OrganisationUnitChildren>;
  parentId: string;
  currentOrgunit: string;
  organisationUnitForm: FormGroup;
  organisationUnit: OrganisationUnitChildren;
  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.parentId = this.route.snapshot.params['parentid'];
    this.currentOrgunit = this.route.snapshot.params['childid'];
    this.selectedOrgunitChild$ = this.store.select(
      getSelectedOrgunitChild(this.currentOrgunit)
    );
    this.organisationUnitForm = this.generateForm();
  }

  ngOnDestroy() {
    this.orgunitSubscription.unsubscribe();
    if (this.childSubscription) {
      this.childSubscription.unsubscribe();
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
      attributeValues: new FormControl(this.organisationUnit.attributeValues[0]?this.organisationUnit.attributeValues[0].value: "")
    });
  }

  editOrgunit(e) {
    e.stopPropagation();
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

  onCancel(e) {
    e.stopPropagation();
    this.router.navigate([`/organisationunit/${this.parentId}`]);
  }
}
