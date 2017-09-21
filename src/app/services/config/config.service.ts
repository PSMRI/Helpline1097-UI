import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import * as config from 'assets/config.json';

@Injectable()
export class ConfigService {
    private _commonBaseURL: String = 'http://14.142.214.242:8080/commonapi-v1.0/';
    private _helpline1097BaseURL: String = 'http://14.142.214.242:8080/1097api-v1.0V1/';
    private _telephonyServerURL: String = 'http://14.142.214.245/';
    private _localeString = 'en-in';
    private _loginUrl = 'http://14.142.214.242:8080/commonui-v1.0';
    // private _commonBaseURL: String = 'http://10.152.3.99:8080/commonapi-v1.0/';
    // private _helpline1097BaseURL: String = 'http://10.152.3.99:8080/1097api-v1.0/';
    // private _telephonyServerURL: String = 'http://10.201.13.17/';
    // private _localeString = 'en-in';
    // private _loginUrl = 'http://10.152.3.99:8080/commonui-v1.0';
    // private _commonBaseURL: String = 'http://localhost:8080/commonapi-v1.0/';
    // private _helpline1097BaseURL: String = 'http://localhost:8080/1097api-v1.0V1/';
    // private _telephonyServerURL: String = 'http://localhost/';
    // private _localeString = 'en-in';
    // private _loginUrl = 'http://14.142.214.242:8080/commonui-v1.0';
    constructor() {
    //    this.successHandeler(config);
    }

    getCommonBaseURL() {
        return this._commonBaseURL;
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
    getCommonLoginUrl() {
        return this._loginUrl;
    }
    getAdminBaseURL() {
        return '';
    }

    successHandeler(response) {
        this._commonBaseURL = response.commonBaseURL;
        this._helpline1097BaseURL = response.helpline1097BaseURL;
        this._telephonyServerURL = response.telephonyServerURL;
        this._localeString = response.localeString;
        this._loginUrl = response.loginURL;
    }
};
