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
import { _throw } from 'rxjs/observable/throw';


@Injectable()
export class RoleService
{

    test = [];
    private _geturl: string = "http://localhost:8080//roleGet"
    private _saveurl: string = "http://localhost:8080//roleSave"

    constructor( private _http: HttpClient ) { }
    getRole ()
    {

        return this._http.post( this._geturl, {} ).pipe(map( this.extractData ), catchError( this.handleError ));
        // .map(( response: Response ) => response.json() );

    }
    saveRole ( data: any )
    {

        //console.log(data);
        return this._http.post( this._saveurl, data ).pipe(map( this.extractData ), catchError( this.handleError ));

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
