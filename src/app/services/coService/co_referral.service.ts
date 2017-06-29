import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class CoReferralService
{

    test = [];
    headers = new Headers( { 'Content-Type': 'application/json' } );
    options = new RequestOptions( { headers: this.headers } );
    _baseurl = this._config.get1097BaseURL();
    _categoryurl = this._baseurl + "api/helpline1097/co/get/category"
    _subcategoryurl = this._baseurl + "api/helpline1097/co/get/subcategory"
    _getDetailsURL = this._baseurl + "iEMR/saveBenCalReferralMapping"
    _getReferralHistoryURL = this._baseurl + "services/getReferralsHistory";
    _servicetypesurl = this._baseurl + "api/helpline1097/co/get/servicetypes"
    constructor(
        private _http: Http,
        private _config: ConfigService
    ) { }
    // getCategories ()
    // {
    //     return this._http.post( this._categoryurl, this.options )
    //         .map( this.extractData )
    //         .catch( this.handleError );
    // }
    // getSubCategories ( id: any )
    // {
    //     let data = { "categoryID": id };
    //     return this._http.post( this._subcategoryurl, data, this.options )
    //         .map( this.extractData )
    //         .catch( this.handleError );
    // }

    getDetails ( instituteDirectoryID: number, instituteSubDirectoryID: number, stateID: number, districtID: number, districtBranchMappingID: number, createdBy: string, beneficiaryRegID: number, serviceID1097: number,
        benCallID: number )
    {
        // [{"beneficiaryRegID":"123", "benCallID":"1", "serviceID1097":1, 
        // "categoryID":3, "subCategoryID":1, "createdBy":"neeraj"}]

        //instituteDirectoryID, instituteSubDirectoryID, stateID, districtID, districtBranchMappingID
        let data = [ {
            "beneficiaryRegID": beneficiaryRegID, "benCallID": benCallID, "serviceID1097": serviceID1097, "createdBy": createdBy,
            "instituteDirectoryID": instituteDirectoryID, "instituteSubDirectoryID": instituteSubDirectoryID, "stateID": stateID,
            "districtID": districtID, "districtBranchMappingID": districtBranchMappingID
        }];
        return this._http.post( this._getDetailsURL, data,
            this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getReferralHistoryByID ( id: any )
    {
        return this._http.post( this._getReferralHistoryURL, { "beneficiaryRegID": id } ).map( this.extractData ).catch( this.handleError );
    }

    getTypes ()
    {
        return this._http.post( this._servicetypesurl, this.options )
            .map( this.extractData )
            .catch( this.handleError );
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



