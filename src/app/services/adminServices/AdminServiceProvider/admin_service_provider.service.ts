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
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../config/config.service';
@Injectable()
export class SPService
{
    test = [];
    headers = new Headers(
        { 'Content-Type': 'application/json' }
        //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
        //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
        //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
        //  ,{'Access-Control-Allow-Methods': '*'}
    );
    options = new RequestOptions( { headers: this.headers } );
    private _getAdminBaseURL = this.configService.getAdminBaseUrl();
    private _geturl: string = this._getAdminBaseURL + "getprovider";
    private _saveurl: string = this._getAdminBaseURL + "saveprovider";
    private _deleteurl: string = this._getAdminBaseURL + "Delete"
    private _updateurl: string = this._getAdminBaseURL + "UpdateServiceProvider"
    //private _url:string="./app/providerdata.json"
    constructor( private _http: Http, private configService: ConfigService ) { }
    getProviders ()
    {

        return this._http.post( this._geturl, this.options ).map( this.extractData ).catch( this.handleError );
        // .map(( response: Response ) => response.json() );

    }
    saveProviders ( data: any )
    {

        //console.log(data);
        return this._http.post( this._saveurl, data, this.options ).map( this.extractData ).catch( this.handleError );

        // .map(( response: Response ) => response.json() );

    }

    deleteProviders ( request: any )
    {
        return this._http.post( this._deleteurl, request, this.options ).map( this.extractData ).catch( this.handleError );
        // .map(( response: Response ) => response.json() );
    }

    updateProviders ( req: any )
    {
        return this._http.post( this._deleteurl, req, this.options ).map( this.extractData ).catch( this.handleError );
        // .map(( response: Response ) => response.json() );
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
}