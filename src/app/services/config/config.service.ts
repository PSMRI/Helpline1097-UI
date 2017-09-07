import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import * as config from 'assets/config.json';

@Injectable()
export class ConfigService {

    private _commonBaseURL: String = 'http://10.152.3.99:8080/CommonV1/';
    private _helpline1097BaseURL: String = 'http://10.152.3.99:8080/helpline1097APIV1/';
    private _telephonyServerURL: String = 'http://172.16.17.41/';
    private _localeString = 'en-in';
    private _loginUrl = 'http://localhost:4200';
    // private _commonBaseURL: String = 'http://172.16.17.43:8080/CommonV1/';
    // private _helpline1097BaseURL: String = 'http://172.16.17.43:8080/helpline1097APIV1/';
    // private _telephonyServerURL: String = 'http://172.16.17.41/';
    // private _localeString = 'en-in';
    // private _loginUrl = 'http://172.16.17.43:8080/common-ui-1.0';
    constructor() {
        // this.successHandeler(config);
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
        // console.log( response, "config file obj" );
        this._commonBaseURL = response.commonBaseURL;
        this._helpline1097BaseURL = response.helpline1097BaseURL;
        this._telephonyServerURL = response.telephonyServerURL;
        this._localeString = response.localeString;
        this._loginUrl = response.loginURL;
    }
};
