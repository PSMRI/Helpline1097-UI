import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../config/config.service";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor';
import { AuthorizationWrapper } from './../../authorization.wrapper';

@Injectable()
export class FeedbackTypes {
    _helpline1097BaseURL = this._config.get1097BaseURL();
    _commonURL = this._config.getCommonBaseURL();
    _servicetypesurl = this._commonURL + "service/servicetypes";
    _getFeedbackTypesURL = this._commonURL + "feedback/getFeedbackType";
    _getFeedbackSeverityURL = this._commonURL + "feedback/getSeverity";
    constructor(
        // private _http: Http,
        private _config: ConfigService, public intercepted: InterceptedHttp, public _http: AuthorizationWrapper
    ) { }

    getTypes(providerServiceMapID: number) {
        let data = {};
        data['providerServiceMapID'] = providerServiceMapID;
        return this._http.post(this._servicetypesurl, data)
            .map(this.extractData)
            .catch(this.handleError);
    }


    getFeedbackTypesData(serviceID: any) {
        let data = { 'providerServiceMapID': serviceID };
        return this._http.post(this._getFeedbackTypesURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getFeedbackSeverityData(serviceID: any) {
        let data = { 'providerServiceMapID': serviceID };
        return this._http.post(this._getFeedbackSeverityURL, data)
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