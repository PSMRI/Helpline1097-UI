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
import { environment } from 'environments/environment';

const commonIP = 'https://amritwprdev.piramalswasthya.org/';
const IP1097 = 'https://amritwprdev.piramalswasthya.org/';
const telephonyServerIP = 'https://uatcz.piramalswasthya.org/';
const adminIP = 'https://amritwprdev.piramalswasthya.org/';

@Injectable()
export class ConfigService {

    private _commonBaseURL: String = environment.commonAPI;
    private openCommonURL: String = environment.commonAPI;
    private _helpline1097BaseURL: String = environment.ip1097;
    private _telephonyServerURL: String = environment.telephoneServer;
    private _localeString = 'en-in';
    private adminBaseUrl = environment.adminAPI;
    private _opencommonBaseURL: String = environment.commonAPI;
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
