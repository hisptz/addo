import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-organisation-unit-details',
  templateUrl: './organisation-unit-details.component.html',
  styleUrls: ['./organisation-unit-details.component.css']
})
export class OrganisationUnitDetailsComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<OrganisationUnitDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }
}
