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
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { ConfigService } from '../../config/config.service';
@Injectable()
export class SPService
{
    test = [];
    private _getAdminBaseURL = this.configService.getAdminBaseUrl();
    private _geturl: string = this._getAdminBaseURL + "getprovider";
    private _saveurl: string = this._getAdminBaseURL + "saveprovider";
    private _deleteurl: string = this._getAdminBaseURL + "Delete"
    private _updateurl: string = this._getAdminBaseURL + "UpdateServiceProvider"
    //private _url:string="./app/providerdata.json"
    constructor( private _http: HttpClient, private configService: ConfigService ) { }
    getProviders ()
    {

        return this._http.post( this._geturl, {} ).pipe(map( this.extractData ), catchError( this.handleError ));
        // .map(( response: Response ) => response.json() );

    }
    saveProviders ( data: any )
    {

        //console.log(data);
        return this._http.post( this._saveurl, data ).pipe(map( this.extractData ), catchError( this.handleError ));

        // .map(( response: Response ) => response.json() );

    }

    deleteProviders ( request: any )
    {
        return this._http.post( this._deleteurl, request ).pipe(map( this.extractData ), catchError( this.handleError ));
        // .map(( response: Response ) => response.json() );
    }

    updateProviders ( req: any )
    {
        return this._http.post( this._deleteurl, req ).pipe(map( this.extractData ), catchError( this.handleError ));
        // .map(( response: Response ) => response.json() );
    }

    extractData ( response: any )
    {
        if ( response.data )
        {
            return response.data;
        } else
        {
            return response;
        }
    }

    handleError ( error: any )
    {
        return _throw(error);
    }
}