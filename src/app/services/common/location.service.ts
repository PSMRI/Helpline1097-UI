import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";


@Injectable()
export class LocationService {
    _commonBaseURL = this._config.getCommonBaseURL();
    _getStateListURL = this._commonBaseURL + "location/states/";
    _getDistrictListURL = this._commonBaseURL + "location/districts/";
    _getTalukListURL = this._commonBaseURL + "location/taluks/";
    _getBlockListURL = this._commonBaseURL + 'location/districtblocks/';
    _getBranchListURL = this._commonBaseURL + 'location/village/';
    _getInstituteListURL = this._commonBaseURL + 'institute/getInstituteTypes/';
    _getDesignationListURL = this._commonBaseURL + 'institute/getDesignationsByInstitute/';
    _getDirectoriesListURL = this._commonBaseURL + 'directory/getDirectoryV1/';
    _getSubDirectoriesListURL = this._commonBaseURL + 'directory/getSubDirectory/';
    //test = [];
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });
    constructor(
        private _http: Http,
        private _config: ConfigService
    ) { }
    getStates(countryId: number) {
        return this._http.get(this._getStateListURL + countryId, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getDistricts(stateId: number) {
        return this._http.get(this._getDistrictListURL + stateId, this.options)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getTaluks(districtId: number) {
        return this._http.get(this._getTalukListURL + districtId, this.options)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getSTBs(talukId: number) {
        return this._http.get(this._getBlockListURL + talukId, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getBranches(blockId: number) {
        return this._http.get(this._getBranchListURL + blockId, this.options)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getDirectory(serviceID) {
        let data = { 'providerServiceMapID': serviceID };
        return this._http.post(this._getDirectoriesListURL, data, this.options)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getSubDirectory(directoryId: number) {
        let data = {};
        data = { 'instituteDirectoryID': directoryId };
        return this._http.post(this._getSubDirectoriesListURL, data, this.options)
            .map(this.extractData)
            .catch(this.handleError);

    }
    getInstituteList(object: any) {
        // let data = {
        //     'stateID': object.stateID, 'districtID': object.districtID,
        //     'districtBranchMappingID': object.districtBranchMappingID
        // };
        return this._http.post(this._getInstituteListURL, {}, this.options)
            .map(this.extractData)
            .catch(this.handleError);
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