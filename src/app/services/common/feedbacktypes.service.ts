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
export class FeedbackTypes {
    _helpline1097BaseURL = this._config.get1097BaseURL();
    _commonURL = this._config.getCommonBaseURL();
    _servicetypesurl = this._commonURL + 'service/servicetypes';
    _getFeedbackTypesURL = this._commonURL + 'feedback/getFeedbackType';
    // _getFeedbackSeverityURL = this._commonURL + "feedback/getSeverity";
    // _getFeedbackTypesURL = this._helpline104BaseURL + "beneficiary/get/natureOfComplaintTypes";
    _getFeedbackSeverityURL = this._commonURL + 'feedback/getSeverity/';

    getFeedbackIDTypes_url = this._commonURL + 'feedback/getFeedbackType';
    constructor(
        private _config: ConfigService,
        public intercepted: InterceptedHttp,
        public _http: AuthorizationWrapper
    ) { }

    getTypes(providerServiceMapID: number) {
        let data = {};
        data['providerServiceMapID'] = providerServiceMapID;
        return this._http.post(this._servicetypesurl, data)
            .map(this.extractData)
            .catch(this.handleError);
    }


    getFeedbackTypesData(serviceID: any) {
        let data = { 'providerServiceMapID': serviceID };
        return this._http.post(this._getFeedbackTypesURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    // getFeedbackSeverityData(serviceID: any) {
    //     let data = { 'providerServiceMapID': serviceID };
    //     return this._http.post(this._getFeedbackSeverityURL, data)
    //         .map(this.extractData)
    //         .catch(this.handleError);
    // }

// ****//
    // getFeedbackTypesData(data: any) {
    //     return this._http.post(this._getFeedbackTypesURL, data)
    //         .map(this.extractData)
    //         .catch(this.handleError);
    // }

    getFeedbackSeverityData(providerServiceMapID) {
        // let data = {};
        return this._http.post(this._getFeedbackSeverityURL, { 'providerServiceMapID': providerServiceMapID })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getFeedbackTypeID(providerServiceMapID) {
        return this._http.post(this.getFeedbackIDTypes_url, { 'providerServiceMapID': providerServiceMapID })
            .map(this.extractData)
            .catch(this.handleError);
    }

    extractData(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return response.json();
        }
    }

    handleError(response: Response) {
        return response.json()
    }
};
