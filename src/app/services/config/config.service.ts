import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class ConfigService {

    private _commonBaseURL: String = "http://l-185000861.wipro.com:9090/CommonV1/";
    private _helpline1097BaseURL: String = "http://l-185000861.wipro.com:9090/helpline1097APIV1/";
    // private _commonBaseURL: String = "http://10.152.3.99:8080/CommonV1/";
    // private _helpline1097BaseURL: String = "http://10.152.3.99:8080/helpline1097APIV1/";
    private _telephonyServerURL: String = "http://10.201.13.17/";
    private _localeString = 'en-in';

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
};
