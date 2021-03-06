/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { Observable } from 'rxjs';
import { OrganisationUnitChildren } from '../models/organisation-unit.model';

import * as _ from 'lodash';
import { ErrorMessage } from '../core';
import { generateUid } from '../core/helpers/generatedUid';

@Injectable({
  providedIn: 'root',
})
export class OrganisationUnitService {
  constructor(private httpService: NgxDhis2HttpClientService) {}
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

  getReportingRate(pe: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService
        .get(
          `analytics?dimension=dx:t6N3L1IElxb.ACTUAL_REPORTS&dimension=ou:LEVEL-6&dimension=pe:${pe}&version=${generateUid()}`
        )
        .subscribe(
          (response: any) => {
            const allOU = response.metaData.dimensions.ou
              ? response.metaData.dimensions.ou
              : [];
            const rows = response.rows ? response.rows : [];
            const ouValueIndex = response.headers.findIndex(
              (head) => head.name === 'ou'
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

  getReportedFacilities(orgUnitId, pe): Observable<any> {
    return new Observable((observer) => {
      this.getOrgunitChildren(orgUnitId)
        .then((orgunits: OrganisationUnitChildren[]) => {
          this.getReportingRate(pe)
            .then((result) => {
              observer.next(
                _.filter(orgunits, (orgunit: OrganisationUnitChildren) =>
                  _.indexOf(result, orgunit.id) !== -1 ? false : true
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
      'organisationUnits/' +
        id +
        '.json?fields=id,name,level,parent[id,name,parent[id,name,parent[id,name]]]'
    );
  }

  getAllOrgunitDetails(id): Observable<any> {
    return this.httpService.get(
      'organisationUnits/' + id + '.json?fields=id,name,level,*'
    );
  }

  getLegends(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.httpService
          .get(`legendSets.json?fields=legends[id,startValue,endValue,color]`)
          .subscribe(
            (data) => resolve(data),
            (error) => reject(error)
          );
      } catch (error) {
        throw new error(error);
      }
    });
  }

  getPerformanceSms(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.httpService.get(`dataStore/performance/sms`).subscribe(
          (data) => resolve(data),
          (error) => reject(error)
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  getLegendWithMessage(): Observable<any> {
    return new Observable((observer) => {
      let legendSets = {};
      let dataStorePerformance = [];
      this.getLegends().then(
        (legends) => {
          this.getPerformanceSms().then(
            (messages) => {
              legendSets = Object.assign({}, legends);
              dataStorePerformance = [...messages];
              function appendLengedMessage(legendSets, dataStorePerformance) {
                const updatedLegendSets = (legendSets['legendSets'] || []).map(
                  (legendSetItem) => {
                    const currentLegends = (legendSetItem.legends || []).map(
                      (legend) => {
                        return {
                          ...legend,
                          message: legendMessage(
                            legend.id,
                            dataStorePerformance
                          ),
                        };
                      }
                    );
                    return { legends: currentLegends };
                  }
                );
                return { legendSets: updatedLegendSets };
              }

              function legendMessage(
                legendUid: any,
                dataStorePerformance: any
              ) {
                let legendMessageInfo =
                  'No Performance Message for this Particular Indicator';
                // let legendMessageInfo: string;
                (dataStorePerformance || []).forEach((dataStore) => {
                  const allConditions = (dataStore.conditions || []).concat(
                    Object.values(dataStore.otherConditions) || []
                  );
                  const flatternConditions = [].concat.apply([], allConditions);
                  const filteredWithLegendUid = flatternConditions.filter(
                    (item) => item === legendUid
                  );
                  if (filteredWithLegendUid.length > 0) {
                    legendMessageInfo = dataStore.message
                      ? dataStore.message
                      : '';
                  }
                });
                return legendMessageInfo;
              }
              observer.next(
                appendLengedMessage(legendSets, dataStorePerformance)
              );
            },
            (error) => observer.error(error)
          );
        },
        (error) => observer.error(error)
      );
    });
  }

  editOrgunitChildren(orgunitChild: OrganisationUnitChildren): Observable<any> {
    if (orgunitChild.attributeValues.length === 0) {
      console.error('Orgunit uneditable');
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
