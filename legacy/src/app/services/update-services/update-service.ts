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
import { InterceptedHttp } from './../../http.interceptor'
@Injectable()
export class UpdateService {
  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  _baseUrl = this._config.getCommonBaseURL();
  _updatebeneficiaryurl = this._baseUrl + 'beneficiary/update';
  constructor(
    private _http: Http,
    private _config: ConfigService,
    private _httpInterceptor: InterceptedHttp
  ) { }

  updateBeneficiaryData(values: any) {
    console.log('data to be updated in service is', values);
    return this._httpInterceptor.post(this._updatebeneficiaryurl, JSON.stringify(values))
      .map(this.extractData).catch(this.handleError);
  }

  private extractData(response: Response) {
    if (response.json().data) {
      return response.json().data;
    } else {
      return response.json();
    }
  };

  private handleError(error: Response | any) {
    return Observable.throw(error.json());

  };

}
