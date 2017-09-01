import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import * as config from "assets/config.json";

@Injectable()
export class ConfigService
{

    private _commonBaseURL: String = "http://localhost:8080/CommonV1/";
    private _helpline1097BaseURL: String = "http://localhost:8080/helpline1097APIV1/";
    private _telephonyServerURL: String = "http://10.201.13.17/";
    private _localeString = 'en-in';

    constructor()
    {
        this.successHandeler( config );
    }

    getCommonBaseURL ()
    {
        return this._commonBaseURL;
    }
    get1097BaseURL ()
    {
        return this._helpline1097BaseURL;
    }
    getTelephonyServerURL ()
    {
        return this._telephonyServerURL;
    }

    getLocaleString ()
    {
        return this._localeString;
    }

    successHandeler ( response )
    {
        // console.log( response, "config file obj" );
        this._commonBaseURL = response.commonBaseURL;
        this._helpline1097BaseURL = response.helpline1097BaseURL;
        this._telephonyServerURL = response.telephonyServerURL;
        this._localeString = response.localeString;
    }
};
