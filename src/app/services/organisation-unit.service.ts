import { Injectable } from "@angular/core";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";
import { Observable } from "rxjs";
import { OrganisationUnitChildren } from "../models/organisation-unit.model";

import * as _ from "lodash";
import { ErrorMessage } from "../core";

@Injectable({
  providedIn: "root"
})
export class OrganisationUnitService {
  constructor(private httpService: NgxDhis2HttpClientService) {}
  s;
  getOrgunitChildren(orgunitId: string): Promise<any> {
    const fields =
    "id,name,lastUpdated,phoneNumber,level,displayName,code,shortName,openingDate,parent,path,coordinates,attributeValues[value,attribute[id,name]]";
    return new Promise((resolve, reject) => {
      this.httpService
        .get(
          `organisationUnits.json?fields=${fields}&filter=path:ilike:${orgunitId}&filter=level:eq:6&paging=false`
        )
        .subscribe(
          (orgUnits: any) => {
            resolve(orgUnits.organisationUnits);
          },
          (error: ErrorMessage) => {
            reject(error);
          }
        );
    });
  }

  getReportingRate(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService
        .get(
          `analytics?dimension=dx:t6N3L1IElxb.ACTUAL_REPORTS&dimension=ou:LEVEL-6&dimension=pe:LAST_MONTH`
        )
        .subscribe(
          (analytics: any) =>
            resolve(
              _.keys(
                analytics && analytics.metaData && analytics.metaData.dimensions
                  ? analytics.metaData.dimensions.ou || []
                  : []
              )
            ),
          (error: ErrorMessage) => reject(error)
        );
    });
  }

  getFacilities(orgUnitId): Observable<any> {
    return new Observable(observer => {
      this.getOrgunitChildren(orgUnitId)
        .then((orgunits: OrganisationUnitChildren[]) => {
          this.getReportingRate()
            .then((completedOrgunits: string[]) => {
              // console.log(completedOrgunits);
              observer.next(
                _.filter(orgunits, (orgunit: OrganisationUnitChildren) =>
                  _.indexOf(completedOrgunits, orgunit.id) !== -1 ? false : true
                )
              );
            })
            .catch((error: ErrorMessage) => observer.error(error));
        })
        .catch((error: ErrorMessage) => observer.error(error));
    });
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
}
