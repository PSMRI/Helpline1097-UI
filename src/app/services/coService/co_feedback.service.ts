import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class CoFeedbackService
{

    test = [];
    headers = new Headers( { 'Content-Type': 'application/json' } );
    options = new RequestOptions( { headers: this.headers } );
    _baseurl = this._config.get1097BaseURL();
    _servicetypesurl = this._baseurl + "api/helpline1097/co/get/servicetypes"
    _createFeedbackURL = this._baseurl + "co/saveBenFeedback/"
    _getDesignationsURL = this._baseurl + "designation/get/"
    _getFeedbackHistoryByID = this._baseurl + "services/getFeedbacksHistory"
    constructor(
        private _http: Http,
        private _config: ConfigService
    ) { }

    getTypes ()
    {
        return this._http.post( this._servicetypesurl, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }
    createFeedback ( data: any )
    {
        return this._http.post( this._createFeedbackURL, data, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getDesignations ()
    {
        let data = {};
        return this._http.post( this._getDesignationsURL, data, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getFeedbackHistoryById ( id: any, serviceID: any )
    {
        return this._http.post( this._getFeedbackHistoryByID, { "beneficiaryRegID": id, "serviceID": serviceID } ).map( this.extractData ).catch( this.handleError );
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



