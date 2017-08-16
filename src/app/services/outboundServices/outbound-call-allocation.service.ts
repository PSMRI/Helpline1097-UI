import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OutboundCallAllocationService
{

    test = [];
    _baseurl: String = this._config.getCommonBaseURL();
    headers = new Headers(
        { 'Content-Type': 'application/json' }
        //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
        //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
        //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
        //  ,{'Access-Control-Allow-Methods': '*'}
    );

    options = new RequestOptions( { headers: this.headers } );
    private _geturl: string = this._baseurl + 'user/getUsersByProviderID';
    private _allocateurl: string = this._baseurl + "call/outboundAllocation";

    constructor( private _http: Http, private _config: ConfigService ) { }

    getAgents ( providerServiceMapID: number )
    {
        let body = {};
        body[ "providerServiceMapID" ] = providerServiceMapID;
        return this._http.post( this._geturl, body, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }

    allocateCallsToAgenta ( data: any )
    {
        console.log( "inside the call config services" );
        console.log( data );
        return this._http.post( this._allocateurl, data, this.options )
            .map( this.extractData )
            .catch( this.handleError );

    }
    private extractData ( response: Response )
    {

        if ( response.json().data )
        {
            return response.json().data;
        } else
        {
            return response.json();
        }
    };

    private handleError ( error: Response | any )
    {

        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if ( error instanceof Response )
        {
            const body = error.json() || '';
            const err = body.error || JSON.stringify( body );
            errMsg = `${ error.status } - ${ error.statusText || '' } ${ err }`;
        } else
        {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error( errMsg );
        return Observable.throw( errMsg );
    };
}