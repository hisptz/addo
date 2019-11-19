import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable } from 'rxjs';
import { OrganisationUnitChildren } from '../models/organisation-unit.model';

@Injectable({
  providedIn: 'root'
})
export class OrganisationUnitService {
  constructor(private httpService: NgxDhis2HttpClientService) {}

  getOrgunitChildren(orgunitId: string): Observable<any> {
    const fields =
      'id,name,lastUpdated,phoneNumber,level,attributeValues[value,attribute[id,name]]';
    return this.httpService.get(
      `organisationUnits.json?fields=${fields}&filter=path:ilike:${orgunitId}&filter=level:eq:6&paging=false`
    );
  }

  editOrgunitChildren(orgunitChild: OrganisationUnitChildren): Observable<any> {
    return this.httpService.put(
      `29/organisationUnits/${orgunitChild.id}?mergeMode=REPLACE`,
      orgunitChild
    );
  }

  deleteOrgunitChild(orgunitId): Observable<any> {
    return this.httpService.delete(`organisationUnits/${orgunitId}`);
  }

 getReportingRate(): Observable<any> {
    return this.httpService.get(`analytics?dimension=dx:t6N3L1IElxb.ACTUAL_REPORTS&dimension=ou:LEVEL-6&dimension=pe:LAST_MONTH`);
  }
}
