import { KNumberPipe } from './k-number.pipe';
import { SafePipe } from './safe.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { FilterDataTable } from './filter-data-table.pipe';
import { SumByPipe } from './sum-by-property.pipe';
import { FilterByNotInPipe } from './filter-by-not-in.pipe';
import { PaginatePipe } from './paginate.pipe';
import { FilterEntityPipe } from './filter-entity.pipe';
import { ReadableFieldPipe } from './readable-field.pipe';

export const sharedPipes: any[] = [
  PaginatePipe,
  FilterEntityPipe,
  ReadableFieldPipe,
  KNumberPipe,
  SafePipe,
  SafeHtmlPipe,
  FilterDataTable,
  FilterByNotInPipe,
  SumByPipe,
];
export {
  PaginatePipe,
  FilterEntityPipe,
  ReadableFieldPipe,
  KNumberPipe,
  SafePipe,
  SafeHtmlPipe,
  FilterDataTable,
  FilterByNotInPipe,
  SumByPipe,
};
