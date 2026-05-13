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
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import { map, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import { InterceptedHttp } from './../../http.interceptor';
import { AuthorizationWrapper } from './../../authorization.wrapper';


@Injectable()
export class CoCategoryService {

    test = [];
    _baseurl = this._config.get1097BaseURL();
    _commonURL = this._config.getCommonBaseURL();
    _servicetypesurl = this._commonURL + 'service/servicetypes';
    // _servicetypesurl = this._baseurl + 'api/helpline1097/co/get/servicetypes'
    _categoryurl = this._baseurl + 'api/helpline1097/co/get/category';
    _categorybyidurl = this._baseurl + 'api/helpline1097/co/get/categoryByID';
    // _subcategoryurl = this._baseurl + 'api/helpline1097/co/get/subcategory';
    _subcategoryurl = this._commonURL + 'service/subcategory';
    
    _savedetailsurl: string = this._baseurl + 'iEMR/saveBenCalServiceCatSubcatMapping';
    _saveCOdetailsurl: string = this._baseurl + 'iEMR/saveBenCalServiceCOCatSubcatMapping'
    constructor(
        private _http: AuthorizationWrapper,
        private _config: ConfigService,
        private _httpInterceptor: InterceptedHttp
    ) { }

    getTypes(providerServiceMapID: number) {
        const data = {};

        data['providerServiceMapID'] = providerServiceMapID;
        return this._http.post(this._servicetypesurl, data).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }
    getCategories() {
        const obj = {};
        return this._http.post(this._categoryurl, obj).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }
    getCategoriesByID(selectedService: any) {
        const data: any = { 'subServiceID': selectedService };
        return this._http.post(this._categorybyidurl, data).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }
    getSubCategories(id: any) {
        const data = { 'categoryID': id };
        return this._http.post(this._subcategoryurl, data).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    getDetails(subCategoryID: number, createdBy: string, beneficiaryRegID: number, subServiceID: number,
        categoryID: number, benCallID: number) {
        const data = [{
            'beneficiaryRegID': beneficiaryRegID, 'benCallID': benCallID, 'subServiceID': subServiceID,
            'subCategoryID': subCategoryID, 'categoryID': categoryID, 'createdBy': createdBy
        }];
        return this._httpInterceptor.post(this._savedetailsurl, data).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }

    getCODetails(subCategoryID: number, createdBy: string, beneficiaryRegID: number, subServiceID: number,
        categoryID: number, benCallID: number) {
        const data = [{
            'beneficiaryRegID': beneficiaryRegID, 'benCallID': benCallID, 'subServiceID': subServiceID,
            'coSubCategoryID': subCategoryID, 'coCategoryID': categoryID, 'createdBy': createdBy
        }];
        return this._httpInterceptor.post(this._saveCOdetailsurl, data).pipe(
            map(this.extractData),
            catchError(this.handleError));
    }



    extractData(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return _throw(response.json());
        }
    }

    handleError(error: Response) {
        return _throw(error.json());
    }
};



