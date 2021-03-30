import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AuthorizationWrapper } from './../../authorization.wrapper';
@Injectable()
export class OutboundReAllocationService {

    test = [];
    data: any;
     _baseurl: String = this._config.getCommonBaseURL();
    // _baseurl:String='http://localhost:8080/';
    private _geturl: string = this._baseurl + 'user/getUsersByProviderID';
    private _getRolesURL: string = this._baseurl + 'user/getRolesByProviderID';
    private _getReallocationDataURL: string = this._baseurl + 'call/outboundCallCount';
    private _getEverwellReallocationDataURL: string = this._baseurl + 'everwellCall/outboundCallCount';
    private _getoutboundCallListURL: string = this._baseurl + 'call/outboundCallList';
    private moveToBinURL: string = this._baseurl + 'call/resetOutboundCall';
    private everwellMoveToBinURL: string = this._baseurl + 'everwellCall/resetOutboundCall';    
    private _getEverwelloutboundCallListURL: string = this._baseurl + 'everwellCall/outboundCallList';
    private getEverwellFeedBackDetailsURL: string = this._baseurl + '/everwellCall/getEverwellfeedbackDetails';

    constructor(private _http: AuthorizationWrapper, private _config: ConfigService) {
    }

    getAgents(providerServiceMapID: number, roleID: any) {
        let body = {};
        body['providerServiceMapID'] = providerServiceMapID;
        body['RoleID'] = roleID;
        // body["languageName"] = languageName;
        return this._http.post(this._geturl, body)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getRoles(data) {
        return this._http.post(this._getRolesURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getReallocationCalls(data) {
        return this._http.post(this._getReallocationDataURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEverwellReallocationCalls(data) {
        return this._http.post(this._getEverwellReallocationDataURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getOutboundCallList(data) {
        return this._http.post(this._getoutboundCallListURL, data)
            .map(this.extractDataSuccess)
            .catch(this.handleError);
    }

    getEverwellOutboundCallList(data) {
        return this._http.post(this._getEverwelloutboundCallListURL, data)
            .map(this.extractDataSuccess)
            .catch(this.handleError);
    }

    getEverwellFeedBackDetails(data) {
        return this._http.post(this.getEverwellFeedBackDetailsURL, data)
            .map(this.extractDataSuccess)
            .catch(this.handleError);
    }

    moveToBin(data) {
        return this._http.post(this.moveToBinURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    everwellMoveToBin(data) {
        return this._http.post(this.everwellMoveToBinURL, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return Observable.throw(response.json());
        };
    }
    private extractDataSuccess(response: Response) {

        console.log('service me original', response.json().data);
        return response.json().data;
    }

    private handleError(error: Response | any) {
        return Observable.throw(error.json());
    };

}
