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


import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class dataService {
  Userdata: any;
  userPriveliges: any;
  uid: any;
  uname: any;
  benData: any;

  callerNumber: any;
  callID: any;
  beneficiaryData: any = {};
  callData: any = {};
  current_campaign: any;

  benRegId: any;
  roleSelected = new Subject();
  current_role: any;
  current_service: any;
  current_serviceID: any;

  parentBeneficiaryData: any = {};
  cZentrixAgentID: number;
  loginIP: any;
  loginKey: any;
  outBoundCallID: any;
  isCallDisconnected: boolean = false;

  serviceProviderID: any;
  isOutbound: boolean = false;
  current_workingLocationID: any;
  sendHeaderStatus = new Subject();
  currentCampaignName: any;
  outboundBenRegID: any;
  inOutCampaign = new Subject();
  beneficiarySelected = new Subject();
  everwellBeneficiarySelected = new Subject();

  beneficiaryRegID: any;
  outboundData: any;
  outboundEverwellData: any;
  feedbackData = [];
  updatedFeedbackList = [];
  // beneficiaryID: any;
  // myBool$: Observable<boolean>;

  //   reset_flag:boolean;

  //   constructor() {
  //       this.reset_flag = false;
  //       this.myBool$ = this.reset_flag.asObservable();
  //   }
  everwellCallNotConnected: any = "No";
  beneficiary_regID_subject = new Subject();
  checkEverwellResponse: boolean = false;
  previousFeedback: any;
  setUniqueCallIDForInBound = false;
  setUniqueCallIDForOutBound = false;

  inboundOutbound = new BehaviorSubject(null);
  inboundOutbound$ = this.inboundOutbound.asObservable();

  custDisconnectCall = new BehaviorSubject<boolean>(null);
  custDisconnectCall$ = this.custDisconnectCall.asObservable();

  callTypes: any;
  isOutBoundSelected: boolean = false;
  outboundSelectedManual: boolean = false;
  onlyOutboundAvailable: boolean = false;
  appLanguage: any = "English";
  everwellFeedbackCallData: any = [];

  setInboundOutboundValue(response) {
    //this.callTypes=1;
    this.inboundOutbound.next(response);
  }
  clearInboundOutboundValue() {
    //this.callTypes=0;
    this.inboundOutbound.next(0);
  }

  enablePreviousOnCustDisconnect(response) {
    this.custDisconnectCall.next(response);
  }
}
