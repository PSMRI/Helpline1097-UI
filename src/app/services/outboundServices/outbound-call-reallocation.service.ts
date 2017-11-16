import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class OutboundReAllocationService{

    test=[];
    data:any;
    _baseurl: String = this._config.getCommonBaseURL();
    headers = new Headers(
     {'Content-Type': 'application/json'}
    //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
    //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
    //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
    //  ,{'Access-Control-Allow-Methods': '*'}
       );

    constructor(private _http:Http, private _config: ConfigService){
       
        
      }
    options = new RequestOptions({ headers: this.headers });
    private _geturl: string = this._baseurl + 'user/getUsersByProviderID';
    private _getRolesURL: string = this._baseurl + "user/getRolesByProviderID";
    private _getReallocationDataURL: string = this._baseurl+"call/outboundCallCount";
    private _getoutboundCallListURL: string = this._baseurl+"call/outboundCallList";

    private moveToBinURL: string = this._baseurl + "call/resetOutboundCall";

    getAgents ( providerServiceMapID: number, roleID: any)
    {
        let body = {};
        body[ "providerServiceMapID" ] = providerServiceMapID;
        body["RoleID"] = roleID;
        // body["languageName"] = languageName;
        return this._http.post( this._geturl, body, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getRoles(data){
        return this._http.post( this._getRolesURL, data, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getReallocationCalls(data){
       return this._http.post( this._getReallocationDataURL, data, this.options )
            .map( this.extractData )
            .catch( this.handleError ); 
    }

    getOutboundCallList(data){
       return this._http.post( this._getoutboundCallListURL, data, this.options )
            .map( this.extractDataSuccess )
            .catch( this.handleError ); 
    }

    moveToBin(data){
       return this._http.post( this.moveToBinURL, data, this.options )
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

    private extractDataSuccess(response:Response)
    {
       
        console.log("service me original",response.json().data);
        return response.json().data;
    }

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