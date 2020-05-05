import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { CallServices } from './../services/callservices/callservice.service';
import { dataService } from './../services/dataService/data.service';
import { Router } from '@angular/router';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { CzentrixServices } from './../services/czentrix/czentrix.service';

@Component({
  selector: 'app-everwell-outbound-worklist',
  templateUrl: './everwell-outbound-worklist.component.html',
  styleUrls: ['./everwell-outbound-worklist.component.css']
})

export class EverwellOutboundWorklistComponent implements OnInit {
  @Output() onOutboundCall: EventEmitter<any> = new EventEmitter<any>();
  data: any = [];
  constructor(private cz_service : CzentrixServices, private _outBoundService: CallServices, 
    public alertService: ConfirmationDialogsService, private _common: dataService, public router: Router) {
  }

  ngOnInit() {
    this._common.sendHeaderStatus.next("");
    const serviceProviderMapID = this._common.current_service.serviceID;
    const userId = this._common.uid;
    this._outBoundService.getOutboundCallList(serviceProviderMapID, userId).subscribe((response) => {
      this.AssignData(response);
      console.log('Call History Data is', response);
    }, (err) => {
      this.alertService.alert(err.errorMessage, 'error');
      console.log('error in call history ');
    })
  };

  AssignData(outboundHistory: any) {
    this.data = outboundHistory;
  }
  //   modaldata:any;
  viewHistory(data: any) {
    this._common.outboundBenRegID = data.beneficiary.beneficiaryID;
    //  this.onOutboundCall.emit(data); code commented, since routing implemented, calling which was happenning in parent is now here....gursimran 24/5/18
    this._common.outboundData = data;
    this.cz_service.manualDialaNumber("", data.beneficiary.benPhoneMaps[0].phoneNo).subscribe((res) => {
      if (res.status.toLowerCase() === 'fail') {
        this.alertService.alert('Something went wrong in calling', 'error');
      } else {
        this._common.callerNumber = data.beneficiary.benPhoneMaps[0].phoneNo;

    //    this._dataServivce.outboundBenID = data.beneficiary.beneficiaryRegID;
   //     this._dataServivce.outboundCallReqID = data.outboundCallReqID;
        sessionStorage.setItem("isOnCall", "yes");
  //      this._dataServivce.isSelf = data.isSelf;
      }
      console.log('resp', res);
    }, (err) => {
      this.alertService.alert(err.errorMessage);
    });
  }
  backToDashBoard() {
    this.router.navigate(['/MultiRoleScreenComponent/dashboard']);

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
