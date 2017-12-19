import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor'

@Injectable()
export class CallServices {
  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  _baseUrl = this._config.get1097BaseURL();
  _commonURL = this._config.getCommonBaseURL();
  _closecallurl = this._commonURL + 'call/closeCall/';
  _callsummaryurl = this._baseUrl + 'services/getCallSummary/';
  _calltypesurl = this._commonURL + 'call/getCallTypesV1/';
  _outboundCalls = this._commonURL + 'call/outboundCallList/';
  _blacklistCalls = this._commonURL + 'call/getBlacklistNumbers/';
  _blockPhoneNo = this._commonURL + 'call/blockPhoneNumber/';
  _unblockPhoneNo = this._commonURL + 'call/unblockPhoneNumber/';
  _outbouncClose_url = this._commonURL + '/call/completeOutboundCall/';
  _getLanguage_url = this._commonURL + '/beneficiary/getLanguageList/';
  _disconnectCall_url = this._commonURL + '/cti/disconnectCall/';

  _getRecording_url = this._commonURL + "call/nueisanceCallHistory/";

  constructor(
    private _http: Http,
    private _config: ConfigService,
    private _httpInterceptor: InterceptedHttp
  ) { }

  closeCall(values: any) {
    console.log('data to be updated in service is', values);
    return this._httpInterceptor.post(this._closecallurl, values).map(this.extractData).catch(this.handleCustomError);
  }
  disconnectCall(agentID: any) {
    // debugger;
    let disconnectObj = { "agent_id": agentID };
    return this._httpInterceptor.post(this._disconnectCall_url, disconnectObj).map(this.extractData).catch(this.handleCustomError);

  }
  closeOutBoundCall(callID: any, isCompleted: boolean) {
    let outboundObj = {};
    outboundObj['outboundCallReqID'] = callID;
    outboundObj['isCompleted'] = isCompleted;
    return this._httpInterceptor.post(this._outbouncClose_url, outboundObj).map(this.extractData).catch(this.handleCustomError);
  }
  getCallSummary(values: any) {
    console.log('Call summary to be retreived for ', values)
    return this._http.post(this._callsummaryurl, values, this.options).map(this.extractData).catch(this.handleError);
  }
  getCallTypes(values: any) {
    console.log('call types to be retreived for ', values)
    return this._http.post(this._calltypesurl, values, this.options).map(this.extractData).catch(this.handleError);
  }
  getOutboundCallList(serviceID: any, userID?: any) {
    const obj = {};
    if (userID) {
      obj['providerServiceMapID'] = serviceID;
      obj['assignedUserID'] = userID;
    } else {
      obj['providerServiceMapID'] = serviceID;
    }
    return this._httpInterceptor.post(this._outboundCalls, obj).map(this.extractData).catch(this.handleCustomError);
  }
  getBlackListCalls(objSearch: any) {
    return this._httpInterceptor.post(this._blacklistCalls, objSearch).map(this.extractData).catch(this.handleCustomError);
  }

  getLanguages() {
    return this._http.get(this._getLanguage_url, this.options).map(this.extractData).catch(this.handleError);
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

  extractData(response: Response) {
    if (response.json().data) {
      return response.json().data;
    } else {
      return response.json();
    }
  }

  handleError(error: Response) {
    return error.json();
  }
  handleCustomError(error: Response) {
    return Observable.throw(error.json());
  }
}
