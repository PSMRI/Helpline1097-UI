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
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import * as config from 'assets/config.json';

const commonIP = 'http://10.208.122.38:8080/';
const IP1097 = 'http://10.208.122.38:8080/';
const telephonyServerIP = 'http://10.208.122.99/';
const adminIP = 'http://10.208.122.38:8080/';

@Injectable()
export class ConfigService {

    // private _commonBaseURL: String = `${commonIP}commonapi-v1.0/`;
    private _commonBaseURL: String = `http://10.208.122.38:8080/commonapi-v1.2/`;
    // private _commonBaseURL: String=`http://localhost:8080/`;
    // private openCommonURL: String = `${commonIP}commonapi-v1.0/`;
    private openCommonURL: String = `http://10.208.122.38:8080/commonapi-v1.2/`;
    private _helpline1097BaseURL: String = `${IP1097}1097api-v1.0/`;
    private _telephonyServerURL: String = `${telephonyServerIP}`;
    private _localeString = 'en-in';
    private adminBaseUrl = `${adminIP}adminapi-v1.0/`;
    private _opencommonBaseURL: String = `${commonIP}commonapi-v1.2/`;

    // private _commonBaseURL: String = 'http://deviemr.piramalswasthya.org:8080/commonapi-v1.0/';
    // private _helpline1097BaseURL: String = 'http://deviemr.piramalswasthya.org:8080/1097api-v1.0/';
    // private _telephonyServerURL: String = 'http://helplines.piramalswasthya.org/';
    // private _localeString = 'en-in';
    // private _loginUrl = 'http://deviemr.piramalswasthya.org:8080/commonui-v1.0';
    // private adminBaseUrl = 'http://deviemr.piramalswasthya.org:8080/adminapi-v1.0/';

    //for APIMAN
    // private _commonBaseURL: String = "http://10.208.122.38:8080/apiman-gateway/IEMR/Common/1.0/";
    // private openCommonURL: String = "http://10.208.122.38:8080/apiman-gateway/IEMR/Common/open/";
    // private _helpline1097BaseURL: String = 'http://10.208.122.38:8080/apiman-gateway/IEMR/1097/1.0/';
    // private _commonBaseURL: String = 'http://l-185000861.wipro.com:8080/commonapi-v1.0/';
    // private _helpline1097BaseURL: String = 'http://l-185000861.wipro.com:8080/1097api-v1.0/';
    // private _telephonyServerURL: String = 'http://10.208.122.99/';
    // private _localeString = 'en-in';
    // private _loginUrl = 'http://l-185000861.wipro.com:8080/commonui-v1.0';
    // private adminBaseUrl = 'http://l-185000861.wipro.com:8080/adminapi-v1.0/';
    public defaultWrapupTime: any = 120;

    constructor() {
    }

    getCommonBaseURL() {
        return this._commonBaseURL;
    }
    getOpenCommonBaseURL() {
        return this.openCommonURL;
    }
    _getOpenCommonBaseURL() {
        return this._opencommonBaseURL;
    }
    get1097BaseURL() {
        return this._helpline1097BaseURL;
    }
    getTelephonyServerURL() {
        return this._telephonyServerURL;
    }
    getLocaleString() {
        return this._localeString;
    }
    getAdminBaseUrl() {
        return this.adminBaseUrl;
    }
    getOpenCommonBaseUrl() {
        return this.openCommonURL;
    }

};
