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


import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { AuthorizationWrapper } from './../../authorization.wrapper';

@Injectable()
export class CallServices {
  _baseUrl = this._config.get1097BaseURL();
  _commonURL = this._config.getCommonBaseURL();
  _closecallurl = this._commonURL + 'call/closeCall';
  _callsummaryurl = this._baseUrl + 'services/getCallSummary';
  _calltypesurl = this._commonURL + 'call/getCallTypesV1';
  _outboundCalls = this._commonURL + 'call/outboundCallList';
  _blacklistCalls = this._commonURL + 'call/getBlacklistNumbers';
  _blockPhoneNo = this._commonURL + 'call/blockPhoneNumber';
  _unblockPhoneNo = this._commonURL + 'call/unblockPhoneNumber';
  _outbouncClose_url = this._commonURL + 'call/completeOutboundCall';
  _getLanguage_url = this._commonURL + 'beneficiary/getLanguageList';
  _disconnectCall_url = this._commonURL + 'cti/disconnectCall';
  _switchToInbound_url = this._commonURL + 'cti/switchToInbound'
  _getRecording_url = this._commonURL + 'call/nueisanceCallHistory';
  _switchToOutbound_url = this._commonURL + 'cti/switchToOutbound';
  _getCampaignNames_url = this._commonURL + 'cti/getCampaignNames';
  _getCampaignSkills_url = this._commonURL + 'cti/getCampaignSkills';
  _transferCall_url = this._commonURL + 'cti/transferCall';
  _getBeneficiaryURL = this._commonURL + "call/beneficiaryByCallID";
  _getBenOutboundListUrl = this._commonURL + "call/getBenRequestedOutboundCall";
  _servicetypesurl = this._commonURL + "service/servicetypes";
  _outEverwellbouncClose_url = this._commonURL + 'everwellCall/completeOutboundCall';
  _postEverwellFeedback = this._commonURL + 'everwellCall/saveFeedback';
  getWrapupTime = this._commonURL +  'user/role/';
  onceOutbound: boolean = false;
  _everwellCheckAlreadyCalled = this._commonURL + 'everwellCall/checkIfAlreadyCalled';
  cacheApiCallTrigger: any;
  cacheResponse: any;
  constructor(
    private _http: AuthorizationWrapper,
    private _config: ConfigService,
    private _httpInterceptor: InterceptedHttp
  ) { }

  onlyOutbound = false;

  getSubServiceTypes(requestObject: any) {

    return this._http.post(this._servicetypesurl, requestObject)
      .map(this.extractData)
      .catch(this.handleError);
  }

  closeCall(values: any) {
    console.log('data to be updated in service is', values);
    return this._httpInterceptor.post(this._closecallurl, values).map(this.extractData).catch(this.handleCustomError);
  }
  disconnectCall(agentID: any) {
    // debugger;
    let disconnectObj = { 'agent_id': agentID };
    return this._httpInterceptor.post(this._disconnectCall_url, disconnectObj).map(this.extractData).catch(this.handleCustomError);

  }
  closeOutBoundCall(callID: any, isCompleted: boolean) {
    let outboundObj = {};
    outboundObj['outboundCallReqID'] = callID;
    outboundObj['isCompleted'] = isCompleted;
    return this._httpInterceptor.post(this._outbouncClose_url, outboundObj).map(this.extractData).catch(this.handleCustomError);
  }

  closeEverwellOutBoundCall(clsoutboundcalldata:any) {   
    return this._httpInterceptor.postEverwell(this._outEverwellbouncClose_url, clsoutboundcalldata).map(this.extractData).catch(this.handleCustomError);
  }
  getCallSummary(values: any) {
    // debugger
    console.log('Call summary to be retreived for ', values)
    return this._http.post(this._callsummaryurl, values).map(this.extractData).catch(this.handleError);
  }
  getCallTypes(values: any) {
    console.log('call types to be retreived for ', values)
    return this._http.post(this._calltypesurl, values).map(this.extractData).catch(this.handleError);
  }
  getOutboundCallList(serviceID: any, userID?: any) {
    const obj = {};
    if (userID) {
      obj['providerServiceMapID'] = serviceID;
      obj['assignedUserID'] = userID;
    } else {
      obj['providerServiceMapID'] = serviceID;
    }
    obj['is1097'] = true;

    return this._httpInterceptor.post(this._outboundCalls, obj).map(this.extractData).catch(this.handleCustomError);
  }
  getBlackListCalls(objSearch: any) {
    return this._httpInterceptor.post(this._blacklistCalls, objSearch).map(this.extractData).catch(this.handleCustomError);
  }

  getLanguages() {
    return this._http.get(this._getLanguage_url).map(this.extractData).catch(this.handleError);
  }
  blockPhoneNumber(phoneBlockID: any) {
    return this._httpInterceptor.post(this._blockPhoneNo, phoneBlockID).map(this.extractData).catch(this.handleCustomError);
  }
  UnBlockPhoneNumber(phoneBlockID: any) {
    return this._httpInterceptor.post(this._unblockPhoneNo, phoneBlockID).map(this.extractData).catch(this.handleCustomError);

  }

  getRecording(obj) {
    return this._httpInterceptor.post(this._getRecording_url, obj).map(this.extractData).catch(this.handleCustomError);
  }

  switchToInbound(agentID) {
    const agentObj = { 'agent_id': agentID };
    return this._httpInterceptor.post(this._switchToInbound_url, agentObj).map(this.extractData).catch(this.handleCustomError);
  }
  switchToOutbound(agentID) {
    const agentObj = { 'agent_id': agentID };
    return this._httpInterceptor.post(this._switchToOutbound_url, agentObj).map(this.extractData).catch(this.handleCustomError);
  }
  getCampaignNames(serviceNameObj) {
    return this._http.post(this._getCampaignNames_url, serviceNameObj).map(this.extractData).catch(this.handleError);
  }
  getCampaignSkills(campaignName) {
    return this._httpInterceptor.post(this._getCampaignSkills_url, campaignName).map(this.extractData).catch(this.handleCustomError);
  }
  transferCall(data) {
    return this._httpInterceptor.post(this._transferCall_url, data).map(this.extractData).catch(this.handleCustomError);
  }
  getBeneficiaryByCallID(data) {
    return this._http.post(this._getBeneficiaryURL, data).map(this.extractData).catch(this.handleError);
  }
  getBenOutboundList(data) {
    return this._http.post(this._getBenOutboundListUrl, data).map(this.extractData).catch(this.handleError);
  }

  saveEverwellFeedback(data)
  {
    if(this.cacheResponse) {
      return Observable.of(this.cacheResponse);
    }else if (this.cacheApiCallTrigger) 
    {
      return this.cacheApiCallTrigger;
    }
    else
      {
        this.cacheApiCallTrigger=this.postEverwellFeedback(data);
      }
    return this.cacheApiCallTrigger;
  }
  postEverwellFeedback(data: any) {   
    return this._httpInterceptor.post(this._postEverwellFeedback, data).map(this.checkForForstApiCallTrigger).catch(this.handleCustomError);
  }
  checkForForstApiCallTrigger(response: Response) {
    if (response.json().data) {
    this.cacheApiCallTrigger = null;
    this.cacheResponse = response.json().data;
    return this.cacheResponse;
    } else {
      return Observable.throw(response.json());
    }

  }
  extractData(response: Response) {
    if (response.json().data) {
      return response.json().data;
    } else {
      return Observable.throw(response.json());
    }
  }

  handleError(error: Response) {
    return Observable.throw(error.json());
  }
  handleCustomError(error: Response) {
    return Observable.throw(error.json());
  }

   //Shubham Shekhar,03-09-2021,Wrapu up configuration
   getRoleBasedWrapuptime(roleID) {
    return this._httpInterceptor.get(this.getWrapupTime + roleID)
    .map((response: Response) => response.json()).catch((error) => Observable.throw(error.json()));
}

   checkIfAlreadyCalled(obj)
   {
    return this._httpInterceptor.post(this._everwellCheckAlreadyCalled, obj).map(this.extractData).catch(this.handleCustomError);
   }
  
}
