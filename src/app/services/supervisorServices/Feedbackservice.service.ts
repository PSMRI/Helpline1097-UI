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