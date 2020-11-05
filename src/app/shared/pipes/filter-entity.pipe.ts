import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEntity',
})
export class FilterEntityPipe implements PipeTransform {
  transform(list: any[], filterString: string): any[] {
    if (!filterString) {
      return list;
    }
    return (list || []).filter((item: any) => {
      const itemString = Object.keys(item)
        .map((key: string) => (item[key] || '').toLowerCase())
        .join('');

      return itemString.indexOf(filterString) !== -1;
    });
  }
}
