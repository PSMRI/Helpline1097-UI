import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { dataService } from '../dataService/data.service';
import { AuthorizationWrapper } from './../../authorization.wrapper';
import { InterceptedHttp } from './../../http.interceptor'


@Injectable()
export class CzentrixServices {
  openCommonUrl = this._config.getOpenCommonBaseUrl();
  common_url = this._config.getCommonBaseURL();
  address = this._config.getTelephonyServerURL();
  _getAgentStatus_url = this.common_url + 'cti/getAgentState';
  _getIVRSPathDetails_url = this.common_url + 'cti/getIVRSPathDetails';
  _getCallDetails = this.common_url + 'cti/getAgentCallStats';
  setCustomerPreferredLanguageUrl = this.common_url + 'cti/customerPreferredLanguage';
  _dialBeneficiary = this.common_url + 'cti/callBeneficiary';
  _getAgentIPAddressURL = this.common_url + 'cti/getAgentIPAddress';

  agent_id: any;
  // path = 'apps/appsHandler.php?';
  resFormat = 3;
  transaction_id: any;
  ip: any;
  _agentLogOut = this.openCommonUrl + 'cti/doAgentLogout';
  logoutUserUrl = this.openCommonUrl + "user/userLogout";
  phone_num: number;
  constructor(private http: AuthorizationWrapper,
    private _http: Http, private httpInterceptor: InterceptedHttp,
    private _config: ConfigService, private _data: dataService, private normalHTTP: Http) {
    this.agent_id = this._data.cZentrixAgentID;
  }

  // agentLogin(agentId, ipAddress) {
  //   this.transaction_id = 'CTI_LOGIN';
  //   this.agent_id = agentId;
  //   this.ip = ipAddress;

  //   let params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
  //   return this.callAPI(params);
  // }

  getLoginKey(uname, password) {
    return this._http
      // tslint:disable-next-line:max-line-length
      .get(this.address + 'apps/cust_appsHandler.php?transaction_id=CTI_LOGIN_KEY&username=' + uname + '&password=' + password + '&resFormat=3')
      .map(this.extractData).catch(this.handleError);

  }
  agentLogout(agentId, ipAddress) {

    this.transaction_id = 'CTI_LOGOUT';
    // this.agent_id = agentId;
    // this.ip = ipAddress;
    // let params = 'transaction_id=' + this.transaction_id + '&agent_id=' + agentId + '&ip=' + ipAddress + '&resFormat=' + this.resFormat;
    // return this.callAPI(params);
    const loginObj = { 'agent_id': agentId };
    return this.httpInterceptor.post(this._agentLogOut, loginObj).map(this.extractData).catch(this.handleError);

  }

  userLogout() {
    // sessionStorage.clear();
    sessionStorage.removeItem("privilege_flag");
    sessionStorage.removeItem("session_id");
    sessionStorage.removeItem("callTransferred");
    return this.httpInterceptor
      .post(this.logoutUserUrl, {})
      .map(this.extractData)
      .catch(this.handleError);
  }

  // getOnlineAgents(agentId, ipAddress) {
  //   this.transaction_id = 'CTI_ONLINE_AGENTS';
  //   this.agent_id = agentId;
  //   this.ip = ipAddress;

  //   let params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
  //   return this.callAPI(params);
  // }

  getAgentStatus() {

    this.agent_id = this._data.cZentrixAgentID;
    let obj = { 'agent_id': this.agent_id };

    return this.http.post(this._getAgentStatus_url, obj).map(this.extractData).catch(this.handleError);
  }

  getIVRSPathDetails() {

    this.agent_id = this._data.cZentrixAgentID;
    let obj = { 'agent_id': this.agent_id };

    return this.http.post(this._getIVRSPathDetails_url, obj).map(this.extractData).catch(this.handleError);
  }

  getCallDetails() {
    this.agent_id = this._data.cZentrixAgentID;

    let obj = { 'agent_id': this.agent_id };
    return this.http.post(this._getCallDetails, obj).map(this.extractData).catch(this.handleError);
  }
  manualDialaNumber(agentId, phoneNum) {
    const dialObj = { 'agent_id': this.agent_id, 'phone_num': phoneNum };
    return this.httpInterceptor.post(this._dialBeneficiary, dialObj).map(this.extractData).catch(this.handleError);

    // this.transaction_id = 'CTI_DIAL';
    // this.agent_id = agentId;
    // this.ip = ipAddress;
    // this.phone_num = phoneNum;

    // let params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id + '&ip=' + this.ip + '&phone_num=' + this.phone_num + '&resFormat=' + this.resFormat;
    // return this.callAPI(params);
  }

  // transferCall(transferFromAgentId, transferToAgentId, ipAddress) {

  //   this.transaction_id = 'CTI_TRANSFER_AGENT';
  //   this.ip = ipAddress;

  //   // tslint:disable-next-line:max-line-length
  //   let params = 'transaction_id=' + this.transaction_id + '&transfer_ from=' + transferFromAgentId + '&transfer_to=' + transferToAgentId + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
  //   return this.callAPI(params);
  // }

  // getAgentPhoneNumber(agentId) {
  //   this.transaction_id = 'CTI_GETNUMBER';
  //   this.agent_id = agentId;

  //   let params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id + '&resFormat=' + this.resFormat;
  //   return this.callAPI(params);
  // }

  // switchToReadyMode(agentId, ipAddress) {
  //   this.transaction_id = 'CTI_READY';
  //   this.agent_id = agentId;
  //   this.ip = ipAddress;

  //   let params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
  //   return this.callAPI(params);
  // }

  // switchBreakFree(agentId, ipAddress, state) { // state : BREAK / FREE
  //   this.transaction_id = 'CTI_PAUSE';
  //   this.agent_id = agentId;
  //   this.ip = ipAddress;

  //   // tslint:disable-next-line:max-line-length
  //   const params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id + '&state=' + state + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
  //   return this.callAPI(params);
  // }

  // disconnectCall(agentId, ipAddress) {
  //   this.transaction_id = 'CTI_DISCONNECT';
  //   this.agent_id = agentId;
  //   this.ip = ipAddress;

  //   // tslint:disable-next-line:max-line-length
  //   const params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
  //   return this.callAPI(params);
  // }

  // callHoldUnhold(agentId, ipAddress, state) {
  //   this.transaction_id = 'CTI_HOLD';
  //   this.agent_id = agentId;
  //   this.ip = ipAddress;

  //   // tslint:disable-next-line:max-line-length
  //   const params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id + '&state=' + state + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
  //   return this.callAPI(params);
  // }

  // checkAgentStatus(agentId, ipAddress) {
  //   this.transaction_id = 'CTI_CHECK_AGENT_STATE';
  //   this.agent_id = agentId;
  //   this.ip = ipAddress;

  //   // tslint:disable-next-line:max-line-length
  //   const params = 'transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id + '&ip=' + this.ip + '&resFormat=' + this.resFormat;
  //   return this.callAPI(params);
  // }

  blockNumber() {

  }

  getIpAddress(agentId) {
    // this.transaction_id = 'CTI_GET_AGENTIP';
    this.agent_id = agentId;
    let reqObj = {};
    reqObj['agent_id'] = agentId;
    // tslint:disable-next-line:max-line-length
    // const params = 'apps/cust_appsHandler.php?transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id + '&resFormat=' + this.resFormat;
    return this.http.post(this._getAgentIPAddressURL, reqObj).map(this.extractData).catch(this.handleError);
  }

  // callAPI(params) {
  //   return this.http.get(this.address + this.path + params).map((res: Response) => this.extractData(res));
  // }

  // getTodayCallReports() {
  //   this.transaction_id = 'CTI_AGENT_CALL_RECORD';
  //   this.agent_id = this._data.cZentrixAgentID;
  //   // tslint:disable-next-line:max-line-length
  //   const params = 'apps/cust_appsHandler.php?transaction_id=' + this.transaction_id + '&agent_id=' + this.agent_id + '&resFormat=' + this.resFormat;
  //   return this._http.get(this.address + params).map(this.extractData).catch(this.handleError);
  // }

  setCustomerPreferredLanguage(data) {
    return this.http.post(this.setCustomerPreferredLanguageUrl, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    return res.json();
  };

  private handleError(error: Response | any) {
    return Observable.throw(error.json());
  };

}

