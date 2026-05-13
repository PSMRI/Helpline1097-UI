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
import { map, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import { AuthorizationWrapper } from './../../authorization.wrapper';
import { InterceptedHttp } from './../../http.interceptor';

@Injectable()
export class RegisterService {
  _baseUrl = this._config.getCommonBaseURL();
  _helplineURL = this._config.get1097BaseURL();
  _createbeneficiaryurl = this._baseUrl + 'beneficiary/create';
  _getrelationshipurl = this._baseUrl + 'get/beneficiaryRelationship';
  _getuserdata = this._baseUrl + 'beneficiary/searchUserByID';
  _getuserdatabyno = this._baseUrl + 'beneficiary/searchUserByPhone';
  _startCall = this._baseUrl + 'call/startCall';
  _updatebeneficiaryincall = this._baseUrl + 'call/updatebeneficiaryincall';
  _getregistrationdata = this._baseUrl + 'beneficiary/getRegistrationDataV1';
  _searchBeneficiaryURL = this._baseUrl + 'beneficiary/searchBeneficiary';
  constructor(
    private _http: AuthorizationWrapper,
    private _config: ConfigService,
    private httpInterceptor: InterceptedHttp
  ) { }

  generateReg(values: any) {
    values.is1097 = true;
    console.log('Beneficiary data to insert ' + values);
    return this._http.post(this._createbeneficiaryurl, JSON.stringify(values)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  updatebeneficiaryincall(callData: any) {
    callData.is1097 = true;
    console.log('Data for call update: ' + callData);
    return this._http.post(this._updatebeneficiaryincall, callData).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  startCall(data) {
    data.is1097 = true;
    data.isCalledEarlier = false;
    return this._http.post(this._startCall, data).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getRelationships() {
    return this._http.get(this._getrelationshipurl).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  retrieveRegHistory(registrationNo: any) {
    const obj = { 'beneficiaryID': registrationNo, 'is1097': true };
    return this.httpInterceptor.post(this._getuserdata, obj).pipe(
      map(this.extractData),
      catchError(this.customhandleError));
  }
  retrieveBenDetailsByRegID(registrationNo: any) {
    const obj = { 'beneficiaryRegID': registrationNo, 'is1097': true };
    return this.httpInterceptor.post(this._getuserdata, obj).pipe(
      map(this.extractData),
      catchError(this.customhandleError));
  }

  retrieveRegHistoryByPhoneNo(phoneNo: any) {

    const data = { 'phoneNo': phoneNo, 'pageNo': 1, 'rowsPerPage': 1000, 'is1097': true };
    return this.httpInterceptor.post(this._getuserdatabyno, data).pipe(
      map(this.extractData),
      catchError(this.customhandleError));
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
    return this._http.post(this._searchBeneficiaryURL, createData).pipe(
      map(this.extractData), catchError(this.handleError));
  }

  private extractData(res: Response) {
    if (res.json().data) {
      return res.json().data;
    } else {
      return _throw(res.json());
    }
  };

  private customhandleError(error: Response | any) {
    return _throw(error.json());

  };
  private handleError(res: Response) {
    return _throw(res.json());
  };

}
