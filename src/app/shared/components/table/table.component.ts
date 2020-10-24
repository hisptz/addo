import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS } from '../../constants';
import { ConfirmationDialogComponent } from '../../dialogs';
import { PaginationConfig, TableActionOption } from '../../models';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() columnsToDisplay: any[] = [];
  @Input() columnsEntities: any;
  @Input() data: any[] = [];
  @Input() showActionsButtons: boolean;
  @Input() actionOptions: TableActionOption[];
  @Input() addButtonConfig: { text: string; icon: string; color: string };
  @Input() showCountColumn: boolean;
  @Input() loading: boolean;

  searchTerm: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  dataSource: any;

  @Output() selectAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() confirmAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() paginationChange: EventEmitter<PaginationConfig> = new EventEmitter<
    PaginationConfig
  >();
  @Output() addItem: EventEmitter<any> = new EventEmitter<any>();

  get noDataColSpan(): number {
    let columnCount = this.columnsToDisplay ? this.columnsToDisplay.length : 0;

    if (this.showActionsButtons) {
      columnCount++;
    }

    if (this.showCountColumn) {
      columnCount++;
    }

    return columnCount;
  }

  get paginationConfig(): PaginationConfig {
    if (this.data) {
      return {
        pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
        total: this.data.length,
        pageSize: DEFAULT_PAGE_SIZE,
      };
    }

    return null;
  }

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  onSelectAction(e, actionOption: TableActionOption, dataItem: any) {
    e.stopPropagation();
    if (actionOption.needConfirmation) {
      const confirmationDialog = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          actionButtonText: actionOption.confirmationType,
          actionCode: actionOption.confirmationType,
          title: 'Confirmation',
          description: actionOption.confirmationText,
        },
      });

      confirmationDialog.afterClosed().subscribe((result) => {
        if (
          result &&
          result.action &&
          result.action === actionOption.confirmationType
        ) {
          this.confirmAction.emit({ actionOption, dataItem });
        }
      });
    } else {
      this.selectAction.emit({ actionOption, dataItem });
    }
  }

  onSelectItem(e, dataItem: any) {
    e.stopPropagation();
    this.selectAction.emit({ actionOption: { actionCode: '' }, dataItem });
  }

  onFilter(e) {
    e.stopPropagation();
    this.searchTerm = (e.target.value || '').toLowerCase();
  }

  onPageChange(e: PageEvent) {
    if (e) {
      this.paginationChange.emit({
        ...this.paginationConfig,
        page: e.pageIndex + 1,
        pageSize: e.pageSize,
      });
    }
  }

  onAdd(e) {
    e.stopPropagation();
    this.addItem.emit();
  }
}
