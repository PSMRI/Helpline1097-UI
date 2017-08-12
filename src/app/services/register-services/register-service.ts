import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor'

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
  _getregistrationdata = this._baseUrl + 'beneficiary/getRegistrationData';
  _searchBeneficiaryURL = this._baseUrl + "/beneficiary/searchBeneficiary";
  constructor(
    private _http: Http,
    private _config: ConfigService,
    private httpInterceptor: InterceptedHttp
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
    return this.httpInterceptor.get(this._getuserdata + registrationNo)
      .map(this.extractData)
      .catch(this.handleError);
  }

  retrieveRegHistoryByPhoneNo(phoneNo: any) {
    const data = { 'phoneNo': phoneNo, 'pageNo': 1, 'rowsPerPage': 1000 };
    return this._http.post(this._getuserdatabyno, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  searchBenficiary(values: any) {
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    let lastName = "";
    let firstName = "";
    let fatherNameHusbandNameSearch = "";
    let gender = "";
    let beneficiaryID = "";
    let district = "";
    let talukSearch = "";
    if (values.firstName != undefined) {
      firstName = values.firstName;
    }
    if (values.lastName != undefined) {
      lastName = values.lastName;
    }
    if (values.fatherNameHusbandNameSearch != undefined) {
      fatherNameHusbandNameSearch = values.fatherNameHusbandNameSearch;
    }
    if (values.gender != undefined) {
      gender = values.gender;
    }
    if (values.beneficiaryID != undefined) {
      beneficiaryID = values.beneficiaryID;
    }
    if (values.districtSearch != undefined) {
      district = values.districtSearch;
    }
    if (values.talukSearch != undefined) {
      talukSearch = values.talukSearch;
    }

    let createData = '{"firstName":"' + firstName + '","lastName":"' + lastName + '","fatherName":"' + fatherNameHusbandNameSearch + '",'
      + '"genderID":"' + gender + '","beneficiaryID": "' + beneficiaryID + '","i_bendemographics":[{'
      + '"stateID":"' + district + '",'
      + '"cityID":"' + talukSearch + '"'
      + '}]}';
    console.log(createData);
    console.log(district);
    return this._http.post(this._searchBeneficiaryURL, createData, { headers: headers })
      .map(this.extractData).catch(this.handleError);
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
