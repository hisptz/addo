import { Injectable } from "@angular/core";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";
import { Observable } from "rxjs";
import { OrganisationUnitChildren } from "../models/organisation-unit.model";

@Injectable({
  providedIn: "root"
})
export class OrganisationUnitService {
  constructor(private httpServuice: NgxDhis2HttpClientService) {}
  getOrgunitChildren(orgunitId: string): Observable<any> {
    const fields =
      'fields=name,children[id,lastUpdated,contactPerson,level,name,shortName,leaf,displayName,displayShortName,openingDate,parent,path,coordinates,children[id,name,level]]';
      // "fields=id,name,lastUpdated,phoneNumber,level,attributeValues[value,attribute[id,name]]&filter=path:ilike:6";
    return this.httpServuice.get(
      `organisationUnits/${orgunitId}.json?fields=${fields}`
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
