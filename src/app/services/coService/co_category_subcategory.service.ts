import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor'


@Injectable()
export class CoCategoryService
{

    test = [];
    headers = new Headers( { 'Content-Type': 'application/json' } );
    options = new RequestOptions( { headers: this.headers } );
    _baseurl = this._config.get1097BaseURL();
    _commonURL = this._config.getCommonBaseURL();
    _servicetypesurl = this._commonURL + "service/servicetypes";
    // _servicetypesurl = this._baseurl + 'api/helpline1097/co/get/servicetypes'
    _categoryurl = this._baseurl + 'api/helpline1097/co/get/category'
    _categorybyidurl = this._baseurl + 'api/helpline1097/co/get/categoryByID'
    _subcategoryurl = this._baseurl + 'api/helpline1097/co/get/subcategory'
    _savedetailsurl: string = this._baseurl + 'iEMR/saveBenCalServiceCatSubcatMapping'
    _saveCOdetailsurl: string = this._baseurl + 'iEMR/saveBenCalServiceCOCatSubcatMapping'
    constructor(
        private _http: Http,
        private _config: ConfigService,
        private _httpInterceptor: InterceptedHttp
    ) { }

    getTypes ( providerServiceMapID: number )
    {
        let data = {};
        data[ "providerServiceMapID" ] = providerServiceMapID;
        return this._http.post( this._servicetypesurl, data, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getCategories ()
    {
        return this._http.post( this._categoryurl, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }
    getCategoriesByID ( selectedService: any )
    {
        let data: any = { 'subServiceID': selectedService };
        return this._http.post( this._categorybyidurl, data, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }
    getSubCategories ( id: any )
    {
        let data = { 'categoryID': id };
        return this._http.post( this._subcategoryurl, data, this.options )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getDetails ( subCategoryID: number, createdBy: string, beneficiaryRegID: number, subServiceID: number,
        categoryID: number, benCallID: number )
    {
        let data = [ {
            'beneficiaryRegID': beneficiaryRegID, 'benCallID': benCallID, 'subServiceID': subServiceID,
            'subCategoryID': subCategoryID, 'categoryID': categoryID, 'createdBy': createdBy
        }];
        return this._httpInterceptor.post( this._savedetailsurl, data )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getCODetails ( subCategoryID: number, createdBy: string, beneficiaryRegID: number, subServiceID: number,
        categoryID: number, benCallID: number )
    {
        let data = [ {
            'beneficiaryRegID': beneficiaryRegID, 'benCallID': benCallID, 'subServiceID': subServiceID,
            'coSubCategoryID': subCategoryID, 'coCategoryID': categoryID, 'createdBy': createdBy
        }];
        return this._httpInterceptor.post( this._saveCOdetailsurl, data )
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



