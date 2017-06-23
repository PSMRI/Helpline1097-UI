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
		// if ( values.beneficiaryRegID.length > 0 )
		// {
		// 	let updateData = "{";
		// 	if ( values.TitleId ) { updateData = updateData + '"titleID" : ' + values.TitleId + ',' };
		// 	if ( values.GenderID ) { updateData += '"genderID" : ' + values.GenderID + ',' };
		// 	if ( values.MaritalStatusID ) { updateData += '"maritalStatusID" : ' + values.MaritalStatusID + ',' };
		// 	if ( values.AltPhoneTypeID ) { updateData += '"altPhoneTypeID" : ' + values.AltPhoneTypeID + ',' };
		// 	if ( values.PhoneTypeID ) { updateData += '"phoneTypeID" : ' + values.PhoneTypeID + ',' };
		// 	if ( values.ParentBenRegID ) { updateData += '"parentBenRegID" : ' + values.ParentBenRegID + ',' };
		// 	if ( values.BeneficiaryTypeID ) { updateData += '"beneficiaryTypeID" : ' + values.BeneficiaryTypeID + ',' };
		// 	if ( values.caste ) { updateData += '"communityID" : ' + values.caste + ',' };
		// 	if ( values.educationQualification ) { updateData += '"educationID" : ' + values.educationQualification + ',' };
		// 	if ( values.state ) { updateData += '"stateID" : ' + values.state + ',' };
		// 	if ( values.district ) { updateData += '"districtID" : ' + values.district + ',' };
		// 	if ( values.taluk ) { updateData += '"talukID" : ' + values.taluk + ',' };
		// 	if ( values.village ) { updateData += '"districtBranchID" : ' + values.village + ',' };
		// 	if ( values.preferredLanguage ) { updateData += '"languageID" : ' + values.preferredLanguage + ',' };
		// 	if ( values.pincode ) { updateData += '"pincode" : ' + values.pincode + ',' };
		// 	updateData += '"firstName":"' + values.FirstName + '", "middleName":"' + values.LastName
		// 		+ '","lastName":"' + values.LastName + '","dOB":"' + values.DOB + '","fatherName":"",'
		// 		+ '"husbandName":"' + '","phoneNo":"' + values.PhoneNo + '", "altPhoneNo":"' + values.PhoneNo
		// 		+ '", "beneficiaryRegID":"' + values.beneficiaryRegID + '"} ';
		console.log( 'data to be updated in service is', values )
		return this._http.post( this._updatebeneficiaryurl, JSON.stringify( values ), this.options ).map( this.extractData ).catch( this.handleError );
		// }
	}

	private extractData ( res: Response )
	{
		console.log( 'after updation', res );
		return res.json();
	};

	private handleError ( res: Response )
	{
		return res.json();
	};

}
