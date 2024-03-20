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
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { AuthorizationWrapper } from './../../authorization.wrapper';

@Injectable()
export class CoFeedbackService {

    test = [];
    _baseurl = this._config.get1097BaseURL();
    _commonUrl = this._config.getCommonBaseURL();
    _servicetypesurl = this._commonUrl + 'service/servicetypes';
    // _servicetypesurl = this._baseurl + 'api/helpline1097/co/get/servicetypes'
    _createFeedbackURL = this._baseurl + 'co/saveBenFeedback'
    _getDesignationsURL = this._baseurl + 'designation/get'
    // _getFeedbackHistoryByID = this._baseurl + 'services/getFeedbacksHistory'
    _getFeedbackHistory = this._commonUrl + 'feedback/getFeedbacksList';
    constructor(
        private _http: AuthorizationWrapper,
        private _config: ConfigService,
        private _httpInterceptor: InterceptedHttp
    ) { }

    getTypes(providerServiceMapID: number) {
        let data = {};
        data['providerServiceMapID'] = providerServiceMapID;
        return this._http.post(this._servicetypesurl, data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    createFeedback(data: any) {
        return this._httpInterceptor.post(this._createFeedbackURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDesignations() {
        let data = {};
        return this._http.post(this._getDesignationsURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getFeedbackHistoryById(id: any, serviceID: any) {
        return this._http.post(this._getFeedbackHistory, { 'beneficiaryRegID': id, 'serviceID': serviceID })
            .map(this.extractData).catch(this.handleError);
    }

    extractData(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return Observable.throw(response.json());
        }
    }

    handleError(response: Response) {
        return Observable.throw(response.json());
    }
}



