import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class CoCategoryService
{

    test = [];
    headers = new Headers( { 'Content-Type': 'application/json' } );
    options = new RequestOptions( { headers: this.headers } );
    _baseurl = this._config.get1097BaseURL();
    // _baseurl = "http://10.152.3.152:1040/helpline1097API/"
    _categoryurl = this._baseurl + "api/helpline1097/co/get/category"
    _subcategoryurl = this._baseurl + "api/helpline1097/co/get/subcategory"
    _savedetailsurl: string = this._baseurl + "iEMR/saveBenCalServiceCatSubcatMapping"
    constructor(
        private _http: Http,
        private _config: ConfigService
    ) { }
    getCategories ()
    {
        return this._http.post( this._categoryurl, this.options )
            .map( this.extractData )
            .catch( this.handleError );
        //.map((response:Response)=> response.json());        
    }
    getSubCategories ( id: any )
    {
        let data = { "categoryID": id };
        return this._http.post( this._subcategoryurl, data, this.options )
            .map( this.extractData )
            .catch( this.handleError );
        //        .map((response:Response)=> response.json());
    }

    getDetails ( subCategoryID: number, createdBy: string, beneficiaryRegID: number, serviceID1097: number,
        categoryID: number, benCallID: number )
    {
        // [{"beneficiaryRegID":"123", "benCallID":"1", "serviceID1097":1, 
        // "categoryID":3, "subCategoryID":1, "createdBy":"neeraj"}]
        let data = [ {
            "beneficiaryRegID": beneficiaryRegID, "benCallID": benCallID, "serviceID1097": serviceID1097,
            "subCategoryID": subCategoryID, "categoryID": categoryID, "createdBy": createdBy
        }];
        return this._http.post( this._savedetailsurl, data, this.options )
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



