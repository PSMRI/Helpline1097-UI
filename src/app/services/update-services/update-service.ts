import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class UpdateService
{
	headers = new Headers( { 'Content-Type': 'application/json' } );
	options = new RequestOptions( { headers: this.headers } );

	_baseUrl = this._config.getCommonBaseURL();
	_updatebeneficiaryurl = this._baseUrl + "beneficiary/update/";
	constructor(
		private _http: Http,
		private _config: ConfigService
	) { }

	updateBeneficiaryData ( values: any )
	{
		var headers = new Headers();
		headers.append( 'Content-Type', 'application/json' );
		console.log( 'data to be updated in service is', values );
		return this._http.post( this._updatebeneficiaryurl, JSON.stringify( values ), this.options )
			.map( this.extractData ).catch( this.handleError );
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

	private handleError ( res: Response )
	{
		return res.json();
	};

}
