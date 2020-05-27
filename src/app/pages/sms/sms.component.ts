import { Component, OnInit } from "@angular/core";
import { OrganisationUnitService } from "src/app/services/organisation-unit.service";
import { MatDialog } from "@angular/material/dialog";
import { SmseditComponent } from '../smsedit/smsedit.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: "app-sms",
  templateUrl: "./sms.component.html",
  styleUrls: ["./sms.component.css"],
})
export class SmsComponent implements OnInit {
  public legends:  MatTableDataSource<any>;
  performanceColumns: String[] = ["Start"];

  constructor(private legendService: OrganisationUnitService, private dialog: MatDialog) {}

  ngOnInit() {
    this.legendService.getLegendWithMessage().subscribe(
      (data) => {
        this.legends = new MatTableDataSource(data);
      },
      (err: any) => console.log(err)
    );
  }
  onMessageEdit(e, message) {
    e.stopPropagation();
    this.dialog.open(SmseditComponent, {
      data: {message: message},
      height: "370px",
      width: "400px",
    });
  }
}
