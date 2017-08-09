import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { CoReferralService } from './../services/coService/co_referral.service';

@Component({
  selector: 'app-beneficiary-history',
  templateUrl: './beneficiary-history.component.html',
  styleUrls: ['./beneficiary-history.component.css']
})
export class BeneficiaryHistoryComponent implements OnInit {

  public data: any;
  public totalRecord: any;
  constructor(
    public dialogRef: MdDialogRef<BeneficiaryHistoryComponent>,
    @Inject(MD_DIALOG_DATA) public benificiaryHistoryData: any,
    private callService: CoReferralService) { }

  ngOnInit() {
    // benficiary Id
    const benificiaryRegID = this.benificiaryHistoryData;
    this.callService.getBenificiaryCallHistory(benificiaryRegID).subscribe((response) => {
      this.data = response;
      this.totalRecord = response.length;
      console.log('Call History Data is', response);

    }, (err) => {
      console.log('error in call history ');
    })
  }

}
