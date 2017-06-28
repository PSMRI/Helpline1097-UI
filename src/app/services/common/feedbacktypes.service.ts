import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class FeedbackTypes
{
    _commonBaseURL = this._config.get1097BaseURL();
    _getFeedbackTypesURL = this._commonBaseURL + "feedback/gettype/";
    _getFeedbackSeverityURL = this._commonBaseURL + "feedback/getseverity/";
    headers = new Headers( { 'Content-Type': 'application/json' } );
    options = new RequestOptions( { headers: this.headers } );
    constructor(
        private _http: Http,
        private _config: ConfigService
    ) { }
    getFeedbackTypesData ()
    {
        let data = {};
        return this._http.post( this._getFeedbackTypesURL, data, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getFeedbackSeverityData ()
    {
        let data = {};
        return this._http.post( this._getFeedbackSeverityURL, data, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }



    extractData ( response: Response )
    {
        if ( response.json().data )
        {
            return response.json().data;
        } else
        {
            return response.json();
        }
    }

    handleError ( response: Response )
    {
        return response.json()
    }
};