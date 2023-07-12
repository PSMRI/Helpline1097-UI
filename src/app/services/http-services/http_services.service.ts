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

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../config/config.service';


/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 29-05-2017
 * Objective: A common service for all HTTP services, just pass the URL and required DATA
 */

@Injectable()
export class HttpServices {
  common_url = this._config.getOpenCommonBaseURL();
  getLanguageListURL = this.common_url + "beneficiary/getLanguageList";

  language: any;
  appCurrentLanguge = new BehaviorSubject(this.language);
  currentLangugae$ = this.appCurrentLanguge.asObservable();
  constructor(private http: Http,private interceptor: InterceptedHttp,private _config: ConfigService) { };

  // tslint:disable-next-line:indent
  getData(url: string) {
    return this.interceptor.get(url)
      .map(this.handleGetSuccess)
      .catch(this.handleGetError);
  }
	getLanguage(url:string)
	{
		return this.http.get(url)
				.map(this.handleGetSuccess)
				.catch(this.handleGetError);
	}
  	getCommitDetails(url: string) {
		return this.http.get(url)
			.map(this.handleGetSuccess)
			.catch(this.handleGetError);
	}
  handleGetSuccess(response: Response) {
    if (response.json().data) {
      return response.json().data;
    } else {
      return response.json();
    }
  }

  handleGetSuccessForSecurity(response: Response) {
    if (response.json().data) {
      return response.json();
    } else {
      return response.json();
    }
  }


  handleGetError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  postData(url: string, data: any) {
    return this.http.post(url, data)
      .map(this.handleGetSuccess)
      .catch(this.handleGetError);
  }

  postDataForSecurity(url: string, data: any) {
    return this.http.post(url, data)
      .map(this.handleGetSuccessForSecurity)
      .catch(this.handleGetError);
  }

  fetchLanguageSet() {
    return this.interceptor.get(this.getLanguageListURL).map((res) => res.json().data);
  }

  getCurrentLanguage(response) {
    this.language = response;
    this.appCurrentLanguge.next(response);
  }
};



