import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AuthorizationWrapper } from './../../authorization.wrapper';
import { InterceptedHttp } from './../../http.interceptor';

@Injectable()
export class RegisterService {
  _baseUrl = this._config.getCommonBaseURL();
  _helplineURL = this._config.get1097BaseURL();
  _createbeneficiaryurl = this._baseUrl + 'beneficiary/create/';
  _getrelationshipurl = this._baseUrl + 'get/beneficiaryRelationship/';
  _getuserdata = this._baseUrl + 'beneficiary/searchUserByID/';
  _getuserdatabyno = this._baseUrl + 'beneficiary/searchUserByPhone/';
  _startCall = this._baseUrl + 'call/startCall/';
  _updatebeneficiaryincall = this._baseUrl + 'call/updatebeneficiaryincall';
  _getregistrationdata = this._baseUrl + 'beneficiary/getRegistrationDataV1';
  _searchBeneficiaryURL = this._baseUrl + '/beneficiary/searchBeneficiary';
  constructor(
    private _http: AuthorizationWrapper,
    private _config: ConfigService,
    private httpInterceptor: InterceptedHttp
  ) { }

  generateReg(values: any) {
    values.is1097 = true;
    console.log('Beneficiary data to insert ' + values);
    return this._http.post(this._createbeneficiaryurl, JSON.stringify(values))
      .map(this.extractData)
      .catch(this.handleError);
  }

  updatebeneficiaryincall(callData: any) {
    callData.is1097 = true;
    console.log('Data for call update: ' + callData);
    return this._http.post(this._updatebeneficiaryincall, callData)
      .map(this.extractData)
      .catch(this.handleError);
  }
  startCall(data) {
    data.is1097 = true;
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
    const obj = { 'beneficiaryID': registrationNo, 'is1097': true };
    return this.httpInterceptor.post(this._getuserdata, obj)
      .map(this.extractData)
      .catch(this.customhandleError);
  }
  retrieveBenDetailsByRegID(registrationNo: any) {
    const obj = { 'beneficiaryRegID': registrationNo, 'is1097': true };
    return this.httpInterceptor.post(this._getuserdata, obj)
      .map(this.extractData)
      .catch(this.customhandleError);
  }

  retrieveRegHistoryByPhoneNo(phoneNo: any) {

    const data = { 'phoneNo': phoneNo, 'pageNo': 1, 'rowsPerPage': 1000, 'is1097': true };
    return this.httpInterceptor.post(this._getuserdatabyno, data)
      .map(this.extractData)
      .catch(this.customhandleError);
  }

  searchBenficiary(values: any) {
    let lastName = "";
    let firstName = "";
    let fatherNameHusbandNameSearch = "";
    let gender = "";
    let beneficiaryID = "";
    let district = "";
    let talukSearch = "";
    if (values.firstName !== undefined) {
      firstName = values.firstName;
    }
    if (values.lastName !== undefined) {
      lastName = values.lastName;
    }
    if (values.fatherNameHusbandNameSearch !== undefined) {
      fatherNameHusbandNameSearch = values.fatherNameHusbandNameSearch;
    }
    if (values.gender !== undefined) {
      gender = values.gender;
    }
    if (values.beneficiaryID !== undefined) {
      beneficiaryID = values.beneficiaryID;
    }
    if (values.districtSearch !== undefined) {
      district = values.districtSearch;
    }
    if (values.talukSearch !== undefined) {
      talukSearch = values.talukSearch;
    }

    const createData = '{"firstName":"' + firstName + '","lastName":"' + lastName + '","fatherName":"' + fatherNameHusbandNameSearch + '",'
      + '"genderID":"' + gender + '","beneficiaryID": "' + beneficiaryID + '","i_bendemographics":[{'
      + '"stateID":"' + district + '",'
      + '"cityID":"' + talukSearch + '"'
      + '}], "is1097": true }';
    console.log(createData);
    console.log(district);
    return this._http.post(this._searchBeneficiaryURL, createData)
      .map(this.extractData).catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  };

  private customhandleError(error: Response | any) {
    return Observable.throw(error.json());

  };
  private handleError(res: Response) {
    return Observable.throw(res.json());
  };

}
