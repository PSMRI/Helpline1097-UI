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
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { AuthorizationWrapper } from './../../authorization.wrapper';


@Injectable()
export class UserBeneficiaryData {
    _commonBaseURL = this._config.getCommonBaseURL();
    _getUserBeneficaryDataURL = this._commonBaseURL + 'beneficiary/getRegistrationDataV1';
    _searchBeneficiary = this._commonBaseURL + 'beneficiary/searchBeneficiary';
    constructor(
        private _http: AuthorizationWrapper,
        private _config: ConfigService,
        private _httpInterceptor: InterceptedHttp
    ) { }
    getUserBeneficaryData(serviceID: any) {
        let data = { 'providerServiceMapID': serviceID };
        return this._http.post(this._getUserBeneficaryDataURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    searchBenficiary(values: any) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        let lastName = undefined;
        let firstName = undefined;
        let fatherNameHusbandNameSearch = undefined;
        let gender = undefined;
        let beneficiaryID = undefined;
        let district = undefined;
        let talukSearch = undefined;
        let state = undefined;
        if (values.firstName !== undefined) {
            firstName = values.firstName;
        }
        if (values.lastName !== undefined) {
            lastName = values.lastName;
        }
        if (values.fatherNameHusbandNameSearch !== undefined) {
            fatherNameHusbandNameSearch = values.fatherNameHusbandNameSearch;
        }
        if (values.gender !== undefined) {
            gender = values.gender;
        }
        if (values.beneficiaryID !== undefined) {
            beneficiaryID = values.beneficiaryID;
        }
        if (values.stateSearch !== undefined) {
            state = values.stateSearch;
        }
        if (values.districtSearch !== undefined) {
            district = values.districtSearch;
        }
        if (values.talukSearch !== undefined) {
            talukSearch = values.talukSearch;
        }

        const createData = {};
        createData['firstName'] = firstName;
        createData['lastName'] = lastName;
        createData['fatherName'] = fatherNameHusbandNameSearch;
        createData['genderID'] = gender;
        createData['beneficiaryID'] = beneficiaryID;
        createData['firstName'] = firstName;
        createData['i_bendemographics'] = {};
        createData['i_bendemographics']['stateID'] = state;
        createData['i_bendemographics']['districtID'] = district;
        createData['i_bendemographics']['blockID'] = talukSearch;
        createData['is1097'] = true;
        return this._httpInterceptor.post(this._searchBeneficiary, createData)
            .map(this.extractData).catch(this.handleError);
    }


    extractData(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return Observable.throw(response.json());
        }
    }

    handleError(error: Response) {
        return Observable.throw(error.json());
    }
};
