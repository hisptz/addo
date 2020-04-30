import { Injectable } from "@angular/core";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";
import { Observable, throwError } from "rxjs";
import { OrganisationUnitChildren } from "../models/organisation-unit.model";

import * as _ from "lodash";
import { ErrorMessage } from "../core";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class OrganisationUnitService {
  constructor(private httpService: NgxDhis2HttpClientService) {}
  s;
  getOrgunitChildren(orgunitId: string): Promise<any> {
    const fields = `id,name,lastUpdated,phoneNumber,level,displayName,code,shortName,openingDate,parent[id,name,
        parent[id,name,parent[id,name,parent[id,name]]]],path,coordinates,attributeValues[value,attribute[id,name]]`;
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

  getReportingRate(pe): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService
        .get(
          `analytics?dimension=dx:t6N3L1IElxb.ACTUAL_REPORTS&dimension=ou:LEVEL-6&dimension=pe:${pe}`
        )
        .subscribe(
          (response: any) => {
            const allOU = response.metaData.dimensions.ou
              ? response.metaData.dimensions.ou
              : [];
            const rows = response.rows ? response.rows : [];
            const ouValueIndex = response.headers.findIndex(
              (head) => head.name === "ou"
            );
            const nonReportingOU = [];
            allOU.forEach((ou) => {
              const currentOU = rows.filter((row) => row[ouValueIndex] === ou);
              if (currentOU.length === 0) {
                nonReportingOU.push(ou);
              }
            });
            resolve(nonReportingOU);
          },
          (error: ErrorMessage) => reject(error)
        );
    });
  }
  getFacilities(orgUnitId, pe): Observable<any> {
    return new Observable((observer) => {
      this.getOrgunitChildren(orgUnitId)
        .then((orgunits: OrganisationUnitChildren[]) => {
          this.getReportingRate(pe)
            .then((result) => {
              observer.next(
                _.filter(orgunits, (orgunit: OrganisationUnitChildren) =>
                  _.indexOf(result, orgunit.id) !== -1 ? true : false
                )
              );
            })
            .catch((error: ErrorMessage) => observer.error(error));
        })
        .catch((error: ErrorMessage) => observer.error(error));
    });
  }

  getOrgUnitDetails(id): Observable<any> {
    return this.httpService.get(
      "organisationUnits/" +
        id +
        ".json?fields=id,name,level,parent[id,name,parent[id,name,parent[id,name]]]"
    );
  }

  getAllOrgunitDetails(id): Observable<any> {
    return this.httpService.get(
      "organisationUnits/" + id + ".json?fields=id,name,level,*"
    );
  }

  getLegends(): Observable<any> {
    try {
      return this.httpService
        .get(`legendSets.json?fields=legends[id,startValue,endValue,color]`)
        .pipe(
          map(
            (data) => {
              console.log(data)
              return data;
            },
            catchError((error) => {
              return throwError(error);
            })
          )
        );
    } catch (error) {}
  }

  getPerformanceSms(): Observable<any> {
    try {
      return this.httpService.get(`dataStore/performance/sms`);
    } catch (e) {}
  }

  editOrgunitChildren(orgunitChild: OrganisationUnitChildren): Observable<any> {
    if (orgunitChild.attributeValues.length === 0) {
    }
    return this.httpService.put(
      `29/organisationUnits/${orgunitChild.id}?mergeMode=REPLACE`,
      orgunitChild
    );
  }

  deleteOrgunitChild(orgunitId): Observable<any> {
    return this.httpService.delete(`organisationUnits/${orgunitId}`);
  }
}
