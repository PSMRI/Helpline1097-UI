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
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { InterceptedHttp } from './../../http.interceptor';
import { Observable } from 'rxjs/Observable';
import { AuthorizationWrapper } from './../../authorization.wrapper';

@Injectable()
export class OutboundCallAllocationService {

    test = [];
     _baseurl: String = this._config.getCommonBaseURL();
    // _baseurl:String='http://10.208.122.38:8080/commonapi-v1.0';
    private _geturl: string = this._baseurl + 'user/getUsersByProviderID';
    private _getRole_url: string = this._baseurl + 'user/getRolesByProviderID';
    private _allocateurl: string = this._baseurl + 'call/outboundAllocation';
    private _allocateEverwellUrl: string = this._baseurl + 'everwellCall/outboundAllocation';
    

    constructor(private _http: AuthorizationWrapper, private _config: ConfigService, private httpIntercept: InterceptedHttp) { }
    getRoles(providerServiceMapID: number) {
        let body = {};
        body['providerServiceMapID'] = providerServiceMapID;
        return this._http.post(this._geturl, body)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getRolesbyProviderID(providerServiceMapID: number) {
        let body = {};
        body['providerServiceMapID'] = providerServiceMapID;
        return this.httpIntercept.post(this._getRole_url, body)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getAgents(providerServiceMapID: number) {
        let body = {};
        body['providerServiceMapID'] = providerServiceMapID;

        return this.httpIntercept.post(this._geturl, body)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getAgentsbyRoleID(providerServiceMapID: number, roleID?: number, languageName?: any) {
        let userArray = [];
        let body = {};
        body['providerServiceMapID'] = providerServiceMapID;
        if (roleID) {
            body['RoleID'] = roleID;
        }
        if (languageName) {
            body['languageName'] = languageName;
        }
        userArray.push(body);
        return this._http.post(this._geturl, body)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getEverwellAgentsbyRoleID(providerServiceMapID: number, roleID?: number, languageName?: any) {
        let userArray = [];
        let body = {};
        body['providerServiceMapID'] = providerServiceMapID;
        if (roleID) {
            body['RoleID'] = roleID;
        }
        if (languageName) {
            body['languageName'] = languageName;
        }  
        userArray.push(body);
        return this._http.post(this._geturl, body)
            .map(this.extractData)
            .catch(this.handleError);
    }
    allocateCallsToAgenta(data: any) {

        return this.httpIntercept.post(this._allocateurl, data)
            .map(this.extractData)
            .catch(this.handleError);

    }
    allocateEverwellCallsToAgenta(data: any) {

        return this.httpIntercept.post(this._allocateEverwellUrl, data)
            .map(this.extractData)
            .catch(this.handleError);

    }
    private extractData(response: Response) {

        if (response.json().data) {
            return response.json().data;
        } else {
            return Observable.throw(response.json());
        }
    };

    private handleError(error: Response | any) {

        // In a real world app, you might use a remote logging infrastructur
        return Observable.throw(error.json());
    };
}