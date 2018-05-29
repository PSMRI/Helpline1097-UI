import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor'
import { AuthorizationWrapper } from './../../authorization.wrapper';
@Injectable()
export class ForceLogoutService {

    commonBaseURL: any;
    force_logout_url: any;
    agent_force_logout_url: any;


    constructor(private _http: AuthorizationWrapper,
        private _config: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.commonBaseURL = this._config.getCommonBaseURL();
        this.force_logout_url = this.commonBaseURL + 'user/forceLogout';
        this.agent_force_logout_url = this.commonBaseURL + 'user/userForceLogout';
    }

    forcelogout(requestObject) {
        return this.httpIntercept.post(this.force_logout_url, requestObject)
            .map(this.handleSuccess).catch(this.handleError);
    }

    agentForceLogout(reqObj) {
        return this.httpIntercept.post(this.agent_force_logout_url, reqObj)
            .map(this.handleSuccess).catch(this.handleError);
    }


    handleSuccess(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return Observable.throw(response.json());
        }
    }

    private handleError(error: Response | any) {
        return Observable.throw(error.json());
    };

}