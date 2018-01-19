import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor'
import { AuthorizationWrapper } from './../../authorization.wrapper';

@Injectable()
export class CoReferralService {

    test = [];
    _baseurl = this._config.get1097BaseURL();
    _commonURL = this._config.getCommonBaseURL();
    _categoryurl = this._commonURL + 'category/categories';
    _subcategoryurl = this._baseurl + 'api/helpline1097/co/get/subcategory';
    _getDetailsURL = this._baseurl + 'iEMR/saveBenCalReferralMapping';
    _getReferralHistoryURL = this._baseurl + 'services/getReferralsHistory';
    _getInformationHistoryURL = this._baseurl + 'services/getInformationsHistory';
    _getCounsellingHistoryURL = this._baseurl + 'services/getCounsellingsHistory';
    // _servicetypesurl = this._baseurl + 'api/helpline1097/co/get/servicetypes';
    _servicetypesurl = this._commonURL + "service/servicetypes";
    _getbenficiaryHistoryUrl = this._baseurl + 'services/getBeneficiaryCallsHistory';
    constructor(
        private _http: AuthorizationWrapper,
        private _config: ConfigService,
        private _httpInterceptor: InterceptedHttp
    ) { }
    // getCategories ()
    // {
    //     return this._http.post( this._categoryurl )
    //         .map( this.extractData )
    //         .catch( this.handleError );
    // }
    // getSubCategories ( id: any )
    // {
    //     let data = { "categoryID": id };
    //     return this._http.post( this._subcategoryurl, data )
    //         .map( this.extractData )
    //         .catch( this.handleError );
    // }

    getDetails(instituteDirectoryID: number, instituteSubDirectoryID: number, stateID: number, districtID: number, districtBranchMappingID: number, createdBy: string, beneficiaryRegID: number, subServiceID: number,
        benCallID: number) {
        let data = [{
            'beneficiaryRegID': beneficiaryRegID, 'benCallID': benCallID, 'subServiceID': subServiceID, 'createdBy': createdBy,
            'instituteDirectoryID': instituteDirectoryID, 'instituteSubDirectoryID': instituteSubDirectoryID, 'stateID': stateID,
            'districtID': districtID, 'blockID': districtBranchMappingID
        }];
        return this._httpInterceptor.post(this._getDetailsURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getReferralHistoryByID(id: any, calledServiceID: any) {
        return this._http.post(this._getReferralHistoryURL, { 'beneficiaryRegID': id, 'calledServiceID': calledServiceID }).map(this.extractData).catch(this.handleError);
    }

    getInformationsHistoryByID(id: any, calledServiceID: any) {
        return this._http.post(this._getInformationHistoryURL, { 'beneficiaryRegID': id, 'calledServiceID': calledServiceID }).map(this.extractData).catch(this.handleError);
    }
    getCounsellingsHistoryByID(id: any, calledServiceID: any) {
        return this._http.post(this._getCounsellingHistoryURL, { 'beneficiaryRegID': id, 'calledServiceID': calledServiceID }).map(this.extractData).catch(this.handleError);
    }
    getTypes(providerServiceMapID: number) {
        let data = {};
        data["providerServiceMapID"] = providerServiceMapID;
        return this._http.post(this._servicetypesurl, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    // get the call history of Beneficiary on the basis of ID
    getBenificiaryCallHistory(id: any, calledServiceID: any) {
        return this._http.post(
            this._getbenficiaryHistoryUrl
            , { 'beneficiaryRegID': id, 'calledServiceID': calledServiceID })
            .map(this.extractData).catch(this.handleError);
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



