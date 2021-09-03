import { Component, OnInit, Inject } from "@angular/core";
import {
  MdDialog,
  MdDialogRef,
  MdDialogConfig,
  MD_DIALOG_DATA,
} from "@angular/material";
import { CoReferralService } from "./../services/coService/co_referral.service";
import { dataService } from "../services/dataService/data.service";

import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
import { DoCheck } from "@angular/core";

@Component({
  selector: "app-beneficiary-history",
  templateUrl: "./beneficiary-history.component.html",
  styleUrls: ["./beneficiary-history.component.css"],
})
export class BeneficiaryHistoryComponent implements OnInit, DoCheck {
  public data: any = [];
  public totalRecord: any;

  currentCallID: any;
  assignSelectedLanguageValue: any;

  constructor(
    public dialogRef: MdDialogRef<BeneficiaryHistoryComponent>,
    @Inject(MD_DIALOG_DATA) public benificiaryHistoryData: any,
    public alertService: ConfirmationDialogsService,
    private callService: CoReferralService,
    private saved_data: dataService,
    private httpServices: HttpServices
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    // benficiary Id
    const benificiaryRegID = this.benificiaryHistoryData;
    const calledServiceID =
      this.saved_data.current_service.providerServiceMapID;
    const currCallID = this.saved_data.callData.benCallID;
    this.currentCallID = this.saved_data.callData.benCallID; // call id of current ongoing call fetched from common data service
    console.log("current callid", this.currentCallID);
    this.callService
      .getBenificiaryCallHistory(benificiaryRegID, calledServiceID)
      .subscribe(
        (response) => this.getFilteredCallHistory(response),
        (err) => this.alertService.alert(err.errorMessage, "error")
      );
  }

  getFilteredCallHistory(response) {
    this.data = [];
    for (let i = 0; i < response.length; i++) {
      if (response[i].benCallID != this.currentCallID) {
        this.data.push(response[i]);
      }
    }
    this.totalRecord = this.data.length;
    console.log("Call History Data is", response);
  }

  toUTCDate(date) {
    const _utc = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
    return _utc;
  }

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  }
  /*
   * JA354063 - Created on 29-07-2021
   */
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
}
