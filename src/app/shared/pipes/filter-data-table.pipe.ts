/**
 * Created by andre on 11/22/18.
 */
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filterDataTable'
})
export class FilterDataTable implements PipeTransform {
  transform(dataArray: any, searchQuery: any): any {
    {
      const splitedQuery = searchQuery ? searchQuery.split(' ') : [];

      return _.filter(dataArray, item => {
        const unifiedName = `${item.facilityName} ${
          item.assinmentDesignation
        } ${item.cadre}`.toLowerCase();
        return (
          _.filter(
            splitedQuery || [],
            queryItem => unifiedName.indexOf(queryItem.toLowerCase()) !== -1
          ).length === (splitedQuery || []).length
        );
      });
    }
  }
}

// const array = [{orgUnit: 'Arusha Region', cadre: 'Assistance nurse'}, {orgUnit: 'Dar Region', cadre: 'Assistance Medical'}, {orgUnit: 'Dodoma Region', cadre: 'Assistance nurse'}, {orgUnit: 'Arusha Council', cadre: 'Assistance Doctor'}];

// const searchQuery = 'Arusha Region'
