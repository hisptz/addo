import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/reducers';
import {
  selectOrganisationUnitSuccess,
  clearOrganisationUnitChildren
} from 'src/app/store/actions';
import { Observable } from 'rxjs';
import { getCurrentUser } from 'src/app/store/selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  orgUnitFilterConfig: any;
  currentUser$: Observable<any>;
  selectedOrgUnit: Array<any> = [];
  isUsertriggered: Boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private store: Store<State>) {
    this.currentUser$ = this.store.select(getCurrentUser);
  }

  ngOnInit() {
    console.log(this.route.snapshot.params)
    if (this.route.snapshot.params["parentid"]) {
      this.selectedOrgUnit = [{id: this.route.snapshot.params["parentid"], name: "", level: 1}]
      this.store.dispatch(clearOrganisationUnitChildren());
        this.store.dispatch(
          selectOrganisationUnitSuccess({
            organisationUnit: {id: this.route.snapshot.params["parentid"], name: "", level: 1}
          })
        );
        this.router.navigate([
          `/organisationunit/${this.route.snapshot.params["parentid"]}`
        ]);
    } else {
      this.currentUser$.subscribe((currentUser) => {
        if (currentUser && currentUser['organisationUnits']) {
          this.selectedOrgUnit = currentUser['organisationUnits']
          this.store.dispatch(clearOrganisationUnitChildren());
          this.store.dispatch(
            selectOrganisationUnitSuccess({
              organisationUnit: currentUser['organisationUnits'][0]
            })
          );
          this.router.navigate([
            `/organisationunit/${currentUser['organisationUnits'][0].id}`
          ]);
        }
      })
    }
    this.orgUnitFilterConfig = {
      singleSelection: true,
      showUserOrgUnitSection: false,
      updateOnSelect: true,
      showOrgUnitLevelGroupSection: false
    };
  }

  onOrgUnitUpdate(orgunitData: any, action: string) {
    this.isUsertriggered = true;
    this.selectedOrgUnit = []
    const selectedOrganisationUnit = orgunitData.items.length > 1? orgunitData.items[1]: orgunitData.items[0];
    this.store.dispatch(clearOrganisationUnitChildren());
    this.store.dispatch(
      selectOrganisationUnitSuccess({
        organisationUnit: selectedOrganisationUnit
      })
    );
    this.router.navigate([
      `/organisationunit/${selectedOrganisationUnit.id}`
    ]);
    if (selectedOrganisationUnit.id !== 'USER_ORGUNIT') {
      
    }
  }
}
