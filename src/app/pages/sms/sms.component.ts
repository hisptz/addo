/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, OnInit } from '@angular/core';
import { OrganisationUnitService } from 'src/app/services/organisation-unit.service';
import { MatDialog } from '@angular/material/dialog';
import { SmseditComponent } from '../smsedit/smsedit.component';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.css'],
})
export class SmsComponent implements OnInit {
  public sms: any;
  public legends: any;
  constructor(
    private legendService: OrganisationUnitService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.legendService.getLegendWithMessage().subscribe(
      (data) => {
        this.legends = data;
      },
      (err: any) => console.log(err)
    );
  }
  onMessageEdit(e, message) {
    e.stopPropagation();
    this.dialog.open(SmseditComponent, {
      data: { message: message },
      height: 'auto',
      width: 'auto',
    });
  }
}
