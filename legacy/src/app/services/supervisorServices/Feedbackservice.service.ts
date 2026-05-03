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
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { Observable } from 'rxjs/Observable';
import { AuthorizationWrapper } from './../../authorization.wrapper';
import 'rxjs/add/operator/catch';


@Injectable()
export class FeedbackService {
    test = [];
    private _commonBaseURL = this._config.getCommonBaseURL();
    private _helpline1097BaseURL = this._config.get1097BaseURL();

    private _feedbackListURL: string = this._config.getCommonBaseURL() + 'feedback/getFeedbacksList';
    private _requestFeedbackURL: string = this._config.getCommonBaseURL() + 'feedback/requestFeedback';
    private _updateResponseURL: string = this._config.getCommonBaseURL() + 'feedback/updateResponse';

    private _getFeedbackStatus: string = this._config.getCommonBaseURL() + 'feedback/getFeedbackStatus'
    private _getEmailStatus: string = this._config.getCommonBaseURL() + 'feedback/getEmailStatus'
    private _fetchEmailIDs = this._config.getCommonBaseURL() + 'emailController/getAuthorityEmailID';
    private sendEmailurl = this._config.getCommonBaseURL() + 'emailController/SendEmail';

    constructor(
        private _http: AuthorizationWrapper,
        private _config: ConfigService,
        private httpIterceptor: InterceptedHttp
    ) { }
    getFeedback(data: any) {
        return this.httpIterceptor.post(this._feedbackListURL, data).map(this.handleSuccess).catch(this.handleCustomError);
        // .map(( response: Response ) => response.json() );
    }

    getFeedbackStatuses() {
        const data = {};
        return this._http.post(this._getFeedbackStatus, data).map(this.handleSuccess).catch(this.handleError);
        // .map(( response: Response ) => response.json() );
    }

    getEmailStatuses() {
        let data = {};
        return this._http.post(this._getEmailStatus, data).map(this.handleSuccess).catch(this.handleError);
    }

    requestFeedback(data: any) {
        return this.httpIterceptor.post(this._requestFeedbackURL, data).map(this.handleSuccess).catch(this.handleCustomError);

    }

    updateResponce(resData: any) {
        return this.httpIterceptor.post(this._updateResponseURL, resData).map(this.handleSuccess).catch(this.handleCustomError);
        // .map(( response: Response ) => response.json() );
    }

    fetchEmails(obj: any) {
        return this.httpIterceptor.post(this._fetchEmailIDs, obj).map(this.handleSuccess).catch(this.handleError);
        // .map(( response: Response ) => response.json() );

    }

    sendEmail(obj) {
        return this.httpIterceptor.post(this.sendEmailurl,obj).map(this.handleSuccess).catch(this.handleSuccess);
    }

    handleSuccess(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return Observable.throw(response.json());

        }
    }
    handleCustomError(error: Response | any) {
        return Observable.throw(error.json());
    }
    handleError(error: Response) {
        return Observable.throw(error.json());
    }
}