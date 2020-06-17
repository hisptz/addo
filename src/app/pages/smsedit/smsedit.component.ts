import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OrganisationUnitService } from "src/app/services/organisation-unit.service";

@Component({
  selector: "app-smsedit",
  templateUrl: "./smsedit.component.html",
  styleUrls: ["./smsedit.component.css"],
})
export class SmseditComponent implements OnInit {
  smsForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SmseditComponent>,
    private orgUnitService: OrganisationUnitService
  ) {}

  ngOnInit() {
    this.smsForm = new FormGroup({
      sms: new FormControl(),
    });
  }

  saveSms(e) {}

  onCancel(e) {
    e.stopPropagation();
  }
}
