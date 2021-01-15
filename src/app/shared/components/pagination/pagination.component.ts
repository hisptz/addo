import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as fromHelpers from '../../helpers/generate-pagination-entry-list';
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input()
  itemsPerPage;

  @Input()
  currentPage;

  @Input()
  pageInterval;

  @Input()
  pageIntervalFactor;

  @Input()
  dataArray;

  @Output()
  updateItemsPerPage: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  changeCurrentPage: EventEmitter<any> = new EventEmitter<any>();

  maxSize: any;
  pagingIntervals: any;

  constructor() {}
  ngOnInit() {
    if (this.dataArray) {
      this.maxSize = this.dataArray.length;

      this.pagingIntervals = fromHelpers.generatePaginationEntryList(
        this.maxSize,
        this.pageIntervalFactor
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.dataArray) {
      this.maxSize = this.dataArray.length;

      this.pagingIntervals = fromHelpers.generatePaginationEntryList(
        this.maxSize,
        this.pageIntervalFactor
      );
    }
  }

  onSetItemsPerPage(e) {
    if (e) {
      e.stopPropagation();
    }
    const pageSize = e ? e.target.value.trim() : this.itemsPerPage;
    this.updateItemsPerPage.emit((this.itemsPerPage = pageSize));
    this.pageInterval = pageSize;
  }

  onChangeCurrentPage(e) {
    if (e) {
      this.changeCurrentPage.emit((this.currentPage = e));
    }
  }
}
