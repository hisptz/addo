import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable } from 'rxjs';
import { OrganisationUnitChildren } from '../models/organisation-unit.model';

@Injectable({
  providedIn: 'root'
})
export class OrganisationUnitService {
  constructor(private httpServuice: NgxDhis2HttpClientService) {}
  s;
  getOrgunitChildren(orgunitId: string): Observable<any> {
    const fields =
      'id,name,lastUpdated,phoneNumber,level,attributeValues[value,attribute[id,name]]';
    return this.httpServuice.get(
      `organisationUnits.json?fields=${fields}&filter=path:ilike:${orgunitId}&filter=level:eq:6&paging=false`
    );
  }

  editOrgunitChildren(orgunitChild: OrganisationUnitChildren): Observable<any> {
    return this.httpServuice.put(
      `29/organisationUnits/${orgunitChild.id}?mergeMode=REPLACE`,
      orgunitChild
    );
  }

  deleteOrgunitChild(orgunitId): Observable<any> {
    return this.httpServuice.delete(`organisationUnits/${orgunitId}`);
  }
}
