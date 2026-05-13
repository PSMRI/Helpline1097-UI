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


import { forwardRef, Inject, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import { map, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import { InterceptedHttp } from './../../http.interceptor';
import { AuthorizationWrapper } from './../../authorization.wrapper';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class loginService {
  openBaseUrl = this._config.getOpenCommonBaseUrl();
  _baseURL = this._config.getCommonBaseURL();
  admin = this._config.getAdminBaseUrl();
  base1097URL = this._config.get1097BaseURL();
  _userAuthURL = this.openBaseUrl + 'user/userAuthenticate';
  _userLogoutPreviousSessionURL = this.openBaseUrl + 'user/logOutUserFromConcurrentSession';
  _forgotPasswordURL = this.openBaseUrl + 'user/forgetPassword';
  _getDetailsByID = this._baseURL + 'user/getUserDetails';
  _validateQuestionAndAnswers = this._baseURL + 'user/validateSecurityQuestionAndAnswer';
  _authorisedUser = this.openBaseUrl + 'user/getLoginResponse';
  apiVersionUrl = this.base1097URL + "version";
  transactionId: any;
  constructor(
    private _http: InterceptedHttp,
    private _config: ConfigService,
    private http:HttpClient,
  ) { }


  public checkAuthorisedUser() {
    return this._http.post(this._authorisedUser, {}).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  public authenticateUser(uname: string, pwd: string, doLogout: boolean, captchaToken?: string): Observable<any> {
    const body: any = {
      userName: uname,
      password: pwd,
      withCredentials: true,
      doLogout: doLogout,
    };
    
    if (captchaToken) { body.captchaToken = captchaToken; }

    return this._http.post(this._userAuthURL, body)
      .pipe(map((res: Response) => {
        const json = res.json();
        if (json.statusCode && json.statusCode !== 200) {
          throw {
            status: json.statusCode,
            errorMessage: json.errorMessage || 'Unknown error'
          };
        }
        return json.data;
      }),
      catchError((err: any) => {
        const payload = err.errorMessage
          ? err
          : (err.json ? err.json() : { errorMessage: err.toString() });
        return _throw(payload);
      }));
  }


  public userLogOutFromPreviousSession(uname: any){
    return this._http.post(this._userLogoutPreviousSessionURL, { 'userName': uname }).pipe(
    map(this.extractDataForSecurity),
    catchError(this.handleError));
  };

  getSecurityQuestions(uname: any): Observable<any> {

    return this._http.post(this._forgotPasswordURL, { 'userName': uname }).pipe(
      map(this.extractDataForSecurity),
      catchError(this.handleError));
  };

  getUserDetailsByID(userID: any) {
    return this._http.post(this._getDetailsByID, { 'userID': userID }).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  getApiVersionDetails() {
    return this._http.get(this.apiVersionUrl).pipe(
      map(res => res.json()));
  }

  validateSecurityQuestionAndAnswer(ans: any, uname: any): Observable<any> {

		return this._http.post(this._validateQuestionAndAnswers, { 'SecurityQuesAns':ans,'userName': uname }).pipe(
			map(this.extractDataForSecurity),
			catchError(this.handleError));
	};



  private extractData(response: Response) {
    console.error("responce-service",response)
    if (response.json().data) {
      return response.json().data;
    } else {
      return _throw(response.json());
    }
  };

  private extractDataForSecurity(response: Response) {
    if (response.json().data) {
      return response.json();
    } else {
      return _throw(response.json());
    }
  };


  private handleError(error: Response | any) {
    console.error("handleError",error)
    return _throw(error.json());

  };
};



