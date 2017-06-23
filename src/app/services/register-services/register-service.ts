import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class RegisterService
{
	headers = new Headers( { 'Content-Type': 'application/json' } );
	options = new RequestOptions( { headers: this.headers } );

	_baseUrl = this._config.getCommonBaseURL();
	_helplineURL = this._config.get1097BaseURL();
	_createbeneficiaryurl = "beneficiary/create/";
	_getrelationshipurl = "get/beneficiaryRelationship/";
	_getuserdata = "beneficiary/searchUser/";
	_getuserdatabyno = "beneficiary/searchUserByPhone/";
	_startCall = "services/startCall/";
	_updatebeneficiaryincall = "services/updatebeneficiaryincall";
	constructor(
		private _http: Http,
		private _config: ConfigService
	) { }

	generateReg ( values: any )
	{
		console.log( "Beneficiary data to insert " + values );
		return this._http.post( this._baseUrl + this._createbeneficiaryurl, JSON.stringify( values ), this.options ).map(( response: Response ) =>
			response.json()
		);
	}

	updatebeneficiaryincall ( callData: any )
	{
		console.log( "Data for call update: " + callData );
		return this._http.post( this._helplineURL + this._updatebeneficiaryincall, callData ).map( this.extractData ).catch( this.handleError );
	}
	startCall ( data )
	{
		console.log( "cndbasmfg" )
		return this._http.post( this._helplineURL + this._startCall, data ).map( this.extractData ).catch( this.handleError );
	}

	getRelationships ()
	{
		console.log( "cndbasmfg" )
		return this._http.get( this._baseUrl + this._getrelationshipurl ).map(( response: Response ) =>
			response.json()
		);
	}

	retrieveRegHistory ( registrationNo: any )
	{
		console.log( "retrieveRegHistory" )
		return this._http.get( this._baseUrl + this._getuserdata + registrationNo ).map(( response: Response ) =>
			response.json()
		);
	}

	retrieveRegHistoryByPhoneNo ( phoneNo: any )
	{
		console.log( "retrieveRegHistoryByPhone" )
		let data = { "phoneNo": phoneNo, "pageNo": 1, "rowsPerPage": 1000 };
		return this._http.post( this._baseUrl + this._getuserdatabyno, data ).map(( response: Response ) =>
			response.json()
		);
	}


	private extractData ( res: Response )
	{
		return res.json();
	};

	private handleError ( res: Response )
	{
		return res.json();
	};

}
