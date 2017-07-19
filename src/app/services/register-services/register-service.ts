import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class RegisterService {
  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  _baseUrl = this._config.getCommonBaseURL();
  _helplineURL = this._config.get1097BaseURL();
  _createbeneficiaryurl = this._baseUrl + 'beneficiary/create/';
  _getrelationshipurl = this._baseUrl + 'get/beneficiaryRelationship/';
  _getuserdata = this._baseUrl + 'beneficiary/searchUser/';
  _getuserdatabyno = this._baseUrl + 'beneficiary/searchUserByPhone/';
  _startCall = this._baseUrl + 'call/startCall/';
  _updatebeneficiaryincall = this._baseUrl + 'call/updatebeneficiaryincall';
  _getregistrationdata= this._baseUrl + 'beneficiary/getRegistrationData'
  constructor(
    private _http: Http,
    private _config: ConfigService
  ) { }

  generateReg(values: any) {
    console.log('Beneficiary data to insert ' + values);
    return this._http.post(this._createbeneficiaryurl, JSON.stringify(values), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updatebeneficiaryincall(callData: any) {
    console.log('Data for call update: ' + callData);
    return this._http.post(this._updatebeneficiaryincall, callData)
      .map(this.extractData)
      .catch(this.handleError);
  }
  startCall(data) {
    return this._http.post(this._startCall, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getRelationships() {
    return this._http.get(this._getrelationshipurl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  retrieveRegHistory(registrationNo: any) {
    return this._http.get(this._getuserdata + registrationNo)
      .map(this.extractData)
      .catch(this.handleError);
  }

  retrieveRegHistoryByPhoneNo(phoneNo: any) {
    const data = { 'phoneNo': phoneNo, 'pageNo': 1, 'rowsPerPage': 1000 };
    return this._http.post(this._getuserdatabyno, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.json().data) {
      return res.json().data;
    } else {
      return res.json();
    }
  };

  private handleError(res: Response) {
    return res.json();
  };

}
