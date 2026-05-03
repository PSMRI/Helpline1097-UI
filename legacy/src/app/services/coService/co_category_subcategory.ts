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
import { ConfigService } from "../config/config.service";
import { AuthorizationWrapper } from './../../authorization.wrapper';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class coCategoryService {

    test = [];
    _baseurl = this._config.getCommonBaseURL();
    _categoryurl = this._baseurl + "";
    _subcategoryurl = this._baseurl + "";
    constructor(
        private _http: AuthorizationWrapper,
        private _config: ConfigService
    ) { }
    getCategories() {
        let obj = {};
        return this._http.post(this._categoryurl, obj)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getSubCategories(data: any) {
        return this._http.post(this._subcategoryurl, data)
            .map(this.extractData)
            .catch(this.handleError);

    }



    extractData(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return Observable.throw(response.json());
        }
    }

    handleError(response: Response) {
        return Observable.throw(response.json());
    }
};



