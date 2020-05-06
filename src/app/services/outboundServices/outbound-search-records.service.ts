import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { InterceptedHttp } from '../../http.interceptor';
import { AuthorizationWrapper } from './../../authorization.wrapper';
@Injectable()
export class OutboundSearchRecordService {

    test = [];
    data: any;
     _baseurl: String = this._config.getCommonBaseURL();
     //_baseurl='http://localhost:8080/';
    private _outboundCalls: string = this._baseurl + 'call/outboundCallList';
    private _outboundCallsCount: string = this._baseurl + 'call/outboundCallCount';
    private _everwelloutboundCallsCount: string = this._baseurl + 'everwellCall/outboundCallCount';
    private _allocateurl: string = this._baseurl + '';
    private _outboundEverwellCalls: string = this._baseurl + 'everwellCall/outboundCallList';
    constructor(private _http: AuthorizationWrapper, private _config: ConfigService, private _httpInterceptor: InterceptedHttp) {
    }

    getUnallocatedCalls(serviceID: any, startDate?: any, endDate?: any, language?: any, userID?: any) {
        const obj = {};
        if (userID) {
            obj['providerServiceMapID'] = serviceID;
            obj['assignedUserID'] = userID;
            obj['preferredLanguageName'] = language;
            obj['is1097'] = true;
        } else {
            obj['providerServiceMapID'] = serviceID;
            obj['filterStartDate'] = startDate;
            obj['filterEndDate'] = endDate;
            obj['preferredLanguageName'] = language;
            obj['is1097'] = true;
        }
        return this._httpInterceptor.post(this._outboundCalls, obj).map(this.extractData).catch(this.handleError);
    }
    getEverwellUnallocatedCalls(serviceID: any, agentId?: any) {
        const obj = {};
        if (agentId) {
            obj['providerServiceMapId'] = serviceID;
            obj['agentId'] = agentId;
        } else {
            obj['providerServiceMapId'] = serviceID;    
        }
        return this._httpInterceptor.post(this._outboundEverwellCalls, obj).map(this.extractData).catch(this.handleError);
    }

    getUnallocatedCallsCount(serviceID: any, startDate?: any, endDate?: any, language?: any, userID?: any) {
        const obj = {};
        if (userID) {
            obj['providerServiceMapID'] = serviceID;
            obj['assignedUserID'] = userID;
        } else {
            obj['providerServiceMapID'] = serviceID;
            obj['filterStartDate'] = startDate;
            obj['filterEndDate'] = endDate;
            obj['preferredLanguageName'] = language;
        }
        return this._httpInterceptor.post(this._outboundCallsCount, obj).map(this.extractData).catch(this.handleError);
    }
    getEverwellUnallocatedCallsCount(serviceID: any,  language?: any, userID?: any) {
        const obj = {};
        if (userID) {
            obj['providerServiceMapId'] = serviceID;
            obj['agentId'] = userID;
        } else {
            obj['providerServiceMapId'] = serviceID;           
            obj['preferredLanguageName'] = language;
        }
        return this._httpInterceptor.post(this._everwelloutboundCallsCount, obj).map(this.extractData).catch(this.handleError);
    }
    getSubRecords(data: any, key: any, val: any) {
        return data.json().filter(data => data.key === val);
    }

    getOutbondCount(val: any) {
        return this._http.post(this._outboundCalls, val)
            .map(this.extractData).catch(this.handleError)
    };

    private extractData(res: Response) {
        console.log('service log: ', res);
        if (res.json().data) {
            return res.json();
        } else {
            return Observable.throw(res.json());
        };
    };
    private handleError(err: Response) {
        return Observable.throw(err.json());
    }

}