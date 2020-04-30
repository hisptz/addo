import { Component, OnInit } from "@angular/core";
import { OrganisationUnitService } from "src/app/services/organisation-unit.service";
import { MatDialog } from "@angular/material";

@Component({
  selector: "app-sms",
  templateUrl: "./sms.component.html",
  styleUrls: ["./sms.component.css"],
})
export class SmsComponent implements OnInit {
  public sms: any;
  public legends: any;
  constructor(private legendService: OrganisationUnitService, private dialog: MatDialog) {}

  ngOnInit() {
    this.legendService.getLegends().subscribe(
      (data) => {
        this.legends = data;
      },
      (err: any) => console.log(err)
    );
  }
  onMessageEdit(e, message) {
    e.stopPropagation();
    this.dialog.open(SmsComponent, {
      data: {message: message},
      height: "auto",
      width: "auto",
    });
  }
}
