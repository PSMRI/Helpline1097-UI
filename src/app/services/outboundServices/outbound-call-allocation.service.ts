import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { InterceptedHttp } from './../../http.interceptor'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OutboundCallAllocationService {

    test = [];
    _baseurl: String = this._config.getCommonBaseURL();
    headers = new Headers(
        { 'Content-Type': 'application/json' }
        //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
        //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
        //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
        //  ,{'Access-Control-Allow-Methods': '*'}
    );

    options = new RequestOptions({ headers: this.headers });
    private _geturl: string = this._baseurl + 'user/getUsersByProviderID';
    private _getRole_url: string = this._baseurl + 'user/getRolesByProviderID';
    private _allocateurl: string = this._baseurl + 'call/outboundAllocation';

    constructor(private _http: Http, private _config: ConfigService, private httpIntercept: InterceptedHttp) { }
    getRoles(providerServiceMapID: number) {
        let body = {};
        body['providerServiceMapID'] = providerServiceMapID;
        return this._http.post(this._geturl, body, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getRolesbyProviderID(providerServiceMapID: number) {
        let body = {};
        body['providerServiceMapID'] = providerServiceMapID;
        return this._http.post(this._getRole_url, body, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getAgents(providerServiceMapID: number) {
        let body = {};
        body['providerServiceMapID'] = providerServiceMapID;

        return this.httpIntercept.post(this._geturl, body)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getAgentsbyRoleID(providerServiceMapID: number, roleID?: number, languageName?: any) {
        let userArray = [];
        let body = {};
        body['providerServiceMapID'] = providerServiceMapID;
        if (roleID) {
            body['RoleID'] = roleID;
        }
        if (languageName) {
            body['languageName'] = languageName;
        }
        userArray.push(body);
        return this._http.post(this._geturl, body, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    allocateCallsToAgenta(data: any) {

        return this.httpIntercept.post(this._allocateurl, data)
            .map(this.extractData)
            .catch(this.handleError);

    }
    private extractData(response: Response) {

        if (response.json().data) {
            return response.json().data;
        } else {
            return response.json();
        }
    };

    private handleError(error: Response | any) {

        // In a real world app, you might use a remote logging infrastructur
        return Observable.throw(error.json());
    };
}