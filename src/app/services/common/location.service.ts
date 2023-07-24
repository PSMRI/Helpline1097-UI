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
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { AuthorizationWrapper } from './../../authorization.wrapper';


@Injectable()
export class LocationService {
    _commonBaseURL = this._config.getCommonBaseURL();
    _getStateListURL = this._commonBaseURL + 'location/states/';
    _getDistrictListURL = this._commonBaseURL + 'location/districts/';
    _getTalukListURL = this._commonBaseURL + 'location/taluks/';
    _getBlockListURL = this._commonBaseURL + 'location/districtblocks/';
    _getBranchListURL = this._commonBaseURL + 'location/village/';
    _getInstituteListURL = this._commonBaseURL + 'institute/getInstituteTypes/';
    _getDesignationListURL = this._commonBaseURL + 'institute/getDesignationsByInstitute/';
    _getDirectoriesListURL = this._commonBaseURL + 'directory/getDirectoryV1/';
    _getSubDirectoriesListURL = this._commonBaseURL + 'directory/getSubDirectory/';
    constructor(
        private _http: AuthorizationWrapper,
        private _config: ConfigService
    ) { }
    getStates(countryId: number) {
        return this._http.get(this._getStateListURL + countryId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getDistricts(stateId: number) {
        return this._http.get(this._getDistrictListURL + stateId)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getTaluks(districtId: number) {
        return this._http.get(this._getTalukListURL + districtId)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getSTBs(talukId: number) {
        return this._http.get(this._getBlockListURL + talukId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getBranches(blockId: number) {
        return this._http.get(this._getBranchListURL + blockId)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getDirectory(serviceID) {
        let data = { 'providerServiceMapID': serviceID };
        return this._http.post(this._getDirectoriesListURL, data)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getSubDirectory(directoryId: number) {
        let data = {};
        data = { 'instituteDirectoryID': directoryId };
        return this._http.post(this._getSubDirectoriesListURL, data)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getInstituteList(object: any) {
        // let data = {
        //     'stateID': object.stateID, 'districtID': object.districtID,
        //     'districtBranchMappingID': object.districtBranchMappingID
        // };
        return this._http.post(this._getInstituteListURL, object)
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


    handleError(error: Response) {
        return Observable.throw(error.json());
    }
}
