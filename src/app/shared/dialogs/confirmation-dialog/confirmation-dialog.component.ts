import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationConfig } from '../../models';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public confirmationConfig: ConfirmationConfig
  ) {}

  ngOnInit(): void {}

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close({
      action: this.confirmationConfig.actionCode,
    });
  }
}
