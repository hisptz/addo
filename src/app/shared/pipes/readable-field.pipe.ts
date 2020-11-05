import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'readableField',
})
export class ReadableFieldPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) {
      return value;
    }
    const date: any = moment(new Date(value));
    if (
      date._isValid &&
      value &&
      typeof value === 'string' &&
      (value.split('-') ? value.split('-').length === 3 : 0)
    ) {
      return moment(value).format('ll');
    }

    return value;
  }
}
