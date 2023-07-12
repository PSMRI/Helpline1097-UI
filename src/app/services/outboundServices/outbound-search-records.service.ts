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


import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { InterceptedHttp } from '../../http.interceptor';
import { AuthorizationWrapper } from './../../authorization.wrapper';
import { DatePipe } from '@angular/common';
@Injectable()
export class OutboundSearchRecordService {

    test = [];
    data: any;
    _baseurl: String = this._config.getCommonBaseURL();
      //_baseurl='http://localhost:8080/';
    private _outboundCalls: string = this._baseurl + 'call/outboundCallList';
    private _outboundCallsCount: string = this._baseurl + 'call/outboundCallCount';
    private _everwelloutboundCallsCount: string = this._baseurl + 'everwellCall/outboundCallCount';
    private _allocateurl: string = this._baseurl + '';
    private _outboundEverwellCalls: string = this._baseurl + 'everwellCall/outboundCallList';
    constructor(private _http: AuthorizationWrapper, private _config: ConfigService, private _httpInterceptor: InterceptedHttp) {
    }

    getUnallocatedCalls(serviceID: any, startDate?: any, endDate?: any, language?: any, userID?: any) {
        const obj = {};
        if (userID) {
            obj['providerServiceMapID'] = serviceID;
            obj['assignedUserID'] = userID;
            obj['preferredLanguageName'] = language;
            obj['is1097'] = true;
        } else {
            obj['providerServiceMapID'] = serviceID;
            obj['filterStartDate'] = startDate;
            obj['filterEndDate'] = endDate;
            obj['preferredLanguageName'] = language;
            obj['is1097'] = true;
        }
        return this._httpInterceptor.post(this._outboundCalls, obj).map(this.extractData).catch(this.handleError);
    }
    // private datePipe: DatePipe
    getEverwellUnallocatedCalls(serviceID: any, startDate?: any, endDate?: any, language?: any,agentId?: any) {
        // endDate = this.datePipe.transform(endDate, 'MM/dd/yyyy');
        const obj = {};
        if (agentId) {
            obj['providerServiceMapId'] = serviceID;
            obj['agentId'] = agentId;
            obj['preferredLanguageName'] = language;
        } else {
            obj['providerServiceMapId'] = serviceID;    
            obj['filterStartDate'] = startDate;
            obj['filterEndDate'] = endDate;
            obj['preferredLanguageName'] = language;
        }
        return this._httpInterceptor.post(this._outboundEverwellCalls, obj).map(this.extractData).catch(this.handleError);
    }

    getUnallocatedCallsCount(serviceID: any, startDate?: any, endDate?: any, language?: any, userID?: any) {
        const obj = {};
        if (userID) {
            obj['providerServiceMapID'] = serviceID;
            obj['assignedUserID'] = userID;
        } else {
            obj['providerServiceMapID'] = serviceID;
            obj['filterStartDate'] = startDate;
            obj['filterEndDate'] = endDate;
            obj['preferredLanguageName'] = language;
        }
        return this._httpInterceptor.post(this._outboundCallsCount, obj).map(this.extractData).catch(this.handleError);
    }
    getEverwellUnallocatedCallsCount(serviceID: any, startDate?: any, endDate?: any, language?: any, userID?: any) {
        const obj = {};
        if (userID) {
            obj['providerServiceMapId'] = serviceID;
            obj['agentId'] = userID;
        } else {
            obj['providerServiceMapId'] = serviceID;  
            obj['filterStartDate'] = startDate;
            obj['filterEndDate'] = endDate;         
            obj['preferredLanguageName'] = language;
        }
        return this._httpInterceptor.post(this._everwelloutboundCallsCount, obj).map(this.extractData).catch(this.handleError);
    }
    getSubRecords(data: any, key: any, val: any) {
        return data.json().filter(data => data.key === val);
    }

    getOutbondCount(val: any) {
        return this._http.post(this._outboundCalls, val)
            .map(this.extractData).catch(this.handleError)
    };

    private extractData(res: Response) {
        console.log('service log: ', res);
        if (res.json().data) {
            return res.json();
        } else {
            return Observable.throw(res.json());
        };
    };
    private handleError(err: Response) {
        return Observable.throw(err.json());
    }

}