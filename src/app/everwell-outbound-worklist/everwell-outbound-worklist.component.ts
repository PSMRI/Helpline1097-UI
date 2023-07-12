/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { CallServices } from './../services/callservices/callservice.service';
import { dataService } from './../services/dataService/data.service';
import { Router } from '@angular/router';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { CzentrixServices } from './../services/czentrix/czentrix.service';
import { OutboundReAllocationService } from "../services/outboundServices/outbound-call-reallocation.service";
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-everwell-outbound-worklist',
  templateUrl: './everwell-outbound-worklist.component.html',
  styleUrls: ['./everwell-outbound-worklist.component.css']
})

export class EverwellOutboundWorklistComponent implements OnInit {
  @Output() onOutboundCall: EventEmitter<any> = new EventEmitter<any>();
  data: any = [];
  filteredsearchResult: any = [];
  currentLanguageSet: any;
  benDetailsList: any;
  constructor(private cz_service : CzentrixServices, private _outBoundService: CallServices, private OCRService: OutboundReAllocationService,
    public alertService: ConfirmationDialogsService, private _common: dataService, public router: Router,
    private HttpServices:HttpServices) {
  }
  
  ngOnInit() {
    this._common.sendHeaderStatus.next("");
    const serviceProviderMapID = this._common.current_service.serviceID;
    const userId = this._common.uid;
    let reqObj = {
      "providerServiceMapId": serviceProviderMapID,
      "agentId": userId
    };  
    this.OCRService.getEverwellOutboundCallList(reqObj).subscribe(response => 
      {
        this.AssignData(response);
        console.log('Everwell Call History Data is', response);
      },
    (err)=> {
      this.alertService.alert(err.errorMessage,'error');
      console.log('Everwell error in call history ');
    });
    this.assignSelectedLanguage();

  };

  AssignData(outboundHistory: any) {
    this.data = outboundHistory;
    this.filteredsearchResult = outboundHistory;
    console.log("beneID in worklist", this.filteredsearchResult)
  }
  //   modaldata:any;
  listBenDetailsOnPhnNo(data: any) {
    this._common.everwellCallNotConnected=null;
    this._common.checkEverwellResponse = false;
    this._common.feedbackData = [];
    this._common.updatedFeedbackList = [];
    this._common.outboundBenRegID = data.beneficiaryRegId;
    console.log("data54", data);
    let req={
      "eapiId":data.eapiId,
      "providerServiceMapId":this._common.current_service.serviceID
    }
    // this._common.beneficiaryID = data.beneficiaryID;
    //  this.onOutboundCall.emit(data); code commented, since routing implemented, calling which was happenning in parent is now here....gursimran 24/5/18
    this._common.outboundEverwellData = data;
    console.log("data54", data);
    this._outBoundService.checkIfAlreadyCalled(req).subscribe((response) => {
      if(response != null && response.isCompleted != undefined && response.isCompleted != null){
        console.log(response);
        if(response.isCompleted == true)
        this.alertService.alert("Call is already completed by agent");
        else{
          this.cz_service.manualDialaNumber("", data.PrimaryNumber).subscribe((res) => {
            if (res.status.toLowerCase() === 'fail') {
              this.alertService.alert(this.currentLanguageSet.somethingWentWrongInCalling, 'error');
            } else {
              this._common.callerNumber = data.PrimaryNumber;
      
          //    this._dataServivce.outboundBenID = data.beneficiary.beneficiaryRegID;
         //     this._dataServivce.outboundCallReqID = data.outboundCallReqID;
              sessionStorage.setItem("isOnCall", "yes");
              sessionStorage.setItem("isEverwellCall", "yes");
        //      this._dataServivce.isSelf = data.isSelf;
            }
          }, (err) => {
            this.alertService.alert(err.errorMessage);
          });
        }
      }
    }, (err) => {
      this.alertService.alert(err.errorMessage, 'error');
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

  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredsearchResult = this.data;
    } else {
      this.filteredsearchResult = [];
      this.data.forEach((item) => {
        for (let key in item) {
          if (key == 'FirstName' || key == 'PrimaryNumber' || key == 'beneficiaryID') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredsearchResult.push(item); break;
            }
          }
        }
      });
    }

  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
}
