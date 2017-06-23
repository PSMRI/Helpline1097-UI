import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class UserBeneficiaryData
{
    _commonBaseURL = this._config.getCommonBaseURL();
    _getUserBeneficaryDataURL = this._commonBaseURL + "beneficiary/getRegistrationData/";
    headers = new Headers( { 'Content-Type': 'application/json' } );
    options = new RequestOptions( { headers: this.headers } );
    constructor(
        private _http: Http,
        private _config: ConfigService
    ) { }
    getUserBeneficaryData ()
    {
        let data = {};
        return this._http.post( this._getUserBeneficaryDataURL, data, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }

    private extractData ( res: Response )
    {
        console.log( res );
        return res.json();
    };

    private handleError ( res: Response )
    {
        console.log( res );
        return res.json();
    };
};