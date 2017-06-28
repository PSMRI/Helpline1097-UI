import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class coCategoryService
{

    test = [];
    headers = new Headers( { 'Content-Type': 'application/json' } );
    options = new RequestOptions( { headers: this.headers } );
    _baseurl = this._config.getCommonBaseURL();
    _categoryurl = this._baseurl + "";
    _subcategoryurl = this._baseurl + "";
    constructor(
        private _http: Http,
        private _config: ConfigService
    ) { }
    getCategories ()
    {
        return this._http.post( this._categoryurl, this.options )
            .map(( response: Response ) => response.json() );
    }
    getSubCategories ( data: any )
    {

        //console.log(data);
        return this._http.post( this._subcategoryurl, data, this.options )

            .map(( response: Response ) => response.json() );

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



