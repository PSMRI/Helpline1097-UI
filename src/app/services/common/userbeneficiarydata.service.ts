import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor'


@Injectable()
export class UserBeneficiaryData {
    _commonBaseURL = this._config.getCommonBaseURL();
    _getUserBeneficaryDataURL = this._commonBaseURL + 'beneficiary/getRegistrationData/';
    _searchBeneficiary = this._commonBaseURL + '/beneficiary/searchBeneficiary';
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });
    constructor(
        private _http: Http,
        private _config: ConfigService,
        private _httpInterceptor: InterceptedHttp
    ) { }
    getUserBeneficaryData(serviceID: any) {
        let data = { 'providerServiceMapID': serviceID };
        return this._http.post(this._getUserBeneficaryDataURL, data, this.options)
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
        return this._httpInterceptor.post(this._searchBeneficiary, createData)
            .map(this.extractData).catch(this.handleError);
    }


    extractData(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return response.json();
        }
    }

    handleError(response: Response) {
        return response.json()
    }
};
