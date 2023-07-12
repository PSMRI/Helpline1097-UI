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
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { AuthorizationWrapper } from './../../authorization.wrapper';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SupervisorCallTypeReportService {

  commonBaseURL: any;
  filterCallList_URL: any;
  getCallTypes_URL: any;

  constructor(private _http: AuthorizationWrapper, private _config: ConfigService) {
    this.commonBaseURL = this._config.getCommonBaseURL();
    this.filterCallList_URL = this.commonBaseURL + "call/filterCallList";
    this.getCallTypes_URL = this.commonBaseURL + "call/getCallTypesV1";
  }

  filterCallList(requestObject) {
    return this._http.post(this.filterCallList_URL, requestObject).map(this.handleSuccess).catch(this.handleError);
  }

  getCallTypes(requestObject) {
    return this._http.post(this.getCallTypes_URL, requestObject).map(this.handleSuccess).catch(this.handleError);
  }

  handleSuccess(response: Response) {
    if (response.json().data) {
      return response.json().data;
    } else {
      return Observable.throw(response.json());
    }
  }

  handleError(error: Response) {
    return Observable.throw(error.json());
  }
}