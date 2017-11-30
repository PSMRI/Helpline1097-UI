import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { CoReferralService } from './../services/coService/co_referral.service';
import { dataService } from '../services/dataService/data.service';


@Component({
  selector: 'app-beneficiary-history',
  templateUrl: './beneficiary-history.component.html',
  styleUrls: ['./beneficiary-history.component.css']
})
export class BeneficiaryHistoryComponent implements OnInit {

  public data: any = [];
  public totalRecord: any;

  currentCallID: any;

  constructor(
    public dialogRef: MdDialogRef<BeneficiaryHistoryComponent>,
    @Inject(MD_DIALOG_DATA) public benificiaryHistoryData: any,
    private callService: CoReferralService,
    private saved_data: dataService) { }

  ngOnInit() {
    // benficiary Id
    const benificiaryRegID = this.benificiaryHistoryData;
    const calledServiceID = this.saved_data.current_service.providerServiceMapID;
    const currCallID = this.saved_data.callData.benCallID;
    this.currentCallID = this.saved_data.callData.benCallID;// call id of current ongoing call fetched from common data service
    console.log("current callid", this.currentCallID);
    this.callService.getBenificiaryCallHistory(benificiaryRegID, calledServiceID).subscribe(response => this.getFilteredCallHistory(response));
  }

  getFilteredCallHistory(response) {
    this.data = [];
    // this.data = response.filter(function(item, currentCallID:any=this.currentCallID)
    // {
    //   if(item.benCallID!=currentCallID)
    //   {
    //     return item;
    //   }
    // });
    for (let i = 0; i < response.length; i++) {
      if (response[i].benCallID != this.currentCallID) {
        this.data.push(response[i]);
      }
    }
    this.totalRecord = this.data.length;
    console.log('Call History Data is', response);

  }

  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };

}
