import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { CallServices } from './../services/callservices/callservice.service';
import { dataService } from './../services/dataService/data.service';
import { Router } from '@angular/router';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { CzentrixServices } from './../services/czentrix/czentrix.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';


@Component({
  selector: 'app-outbond-worklist',
  templateUrl: './outbond-worklist.component.html',
  styleUrls: ['./outbond-worklist.component.css']
})

export class OutbondWorklistComponent implements OnInit {
  @Output() onOutboundCall: EventEmitter<any> = new EventEmitter<any>();
  data: any = [];
  currentLanguageSet: any;
  constructor(private cz_service : CzentrixServices, private _outBoundService: CallServices, 
    public alertService: ConfirmationDialogsService, private _common: dataService, public router: Router,public HttpServices: HttpServices) {
  }

  ngOnInit() {
    this.assignSelectedLanguage();
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
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

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
        this.alertService.alert(this.currentLanguageSet.somethingWentWrongInCalling, 'error');
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
