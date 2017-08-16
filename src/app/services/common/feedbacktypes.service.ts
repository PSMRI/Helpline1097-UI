import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class FeedbackTypes
{
    _helpline1097BaseURL = this._config.get1097BaseURL();
    _commonURL = this._config.getCommonBaseURL();
    _servicetypesurl = this._commonURL + "service/servicetypes";
    _getFeedbackTypesURL = this._helpline1097BaseURL + "feedback/gettype/";
    _getFeedbackSeverityURL = this._helpline1097BaseURL + "feedback/getseverity/";
    // _servicetypesurl = this._helpline1097BaseURL + "api/helpline1097/co/get/servicetypes"
    headers = new Headers( { 'Content-Type': 'application/json' } );
    options = new RequestOptions( { headers: this.headers } );
    constructor(
        private _http: Http,
        private _config: ConfigService
    ) { }

    getTypes ( providerServiceMapID: number )
    {
        let data = {};
        data[ "providerServiceMapID" ] = providerServiceMapID;
        return this._http.post( this._servicetypesurl, data, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }


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