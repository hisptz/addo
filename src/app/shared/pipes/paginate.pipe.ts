import { Pipe, PipeTransform } from '@angular/core';
import { slice, take } from 'lodash';
@Pipe({
  name: 'paginate',
})
export class PaginatePipe implements PipeTransform {
  transform(list: any[], pageSize: number, currentPage: number): unknown {
    return take(slice(list || [], (currentPage - 1) * pageSize), pageSize);
  }
}
