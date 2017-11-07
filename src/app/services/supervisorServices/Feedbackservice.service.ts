import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class FeedbackService {
    test = [];
    headers = new Headers(
        { 'Content-Type': 'application/json' }
        //  ,{'Access-Control-Allow-Headers': 'X-Requested-With, content-type'}
        //   ,{'Access-Control-Allow-Origin': 'localhost:4200'}
        //  ,{'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'}
        //  ,{'Access-Control-Allow-Methods': '*'}
    );
    options = new RequestOptions({ headers: this.headers });
    private _commonBaseURL = this._config.getCommonBaseURL();
    private _helpline1097BaseURL = this._config.get1097BaseURL();

    private _feedbackListURL: string = this._config.getCommonBaseURL() + 'feedback/getFeedbacksList';
    private _requestFeedbackURL: string = this._config.getCommonBaseURL() + 'feedback/requestFeedback';
    private _updateResponseURL: string = this._config.getCommonBaseURL() + 'feedback/updateResponse';

    private _getFeedbackStatus: string = this._config.getCommonBaseURL() + 'feedback/getFeedbackStatus'
    private _getEmailStatus: string = this._config.getCommonBaseURL() + 'feedback/getEmailStatus'

    constructor(
        private _http: Http,
        private _config: ConfigService,
        private httpIterceptor: InterceptedHttp
    ) { }
    getFeedback(data: any) {
        return this.httpIterceptor.post(this._feedbackListURL, data).map(this.handleSuccess).catch(this.handleCustomError);
        // .map(( response: Response ) => response.json() );
    }

    getFeedbackStatuses() {
        const data = {};
        return this._http.post(this._getFeedbackStatus, data, this.options).map(this.handleSuccess).catch(this.handleError);
        // .map(( response: Response ) => response.json() );
    }

    getEmailStatuses() {
        let data = {};
        return this._http.post(this._getEmailStatus, data, this.options).map(this.handleSuccess).catch(this.handleError);
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
            console.log('Status', response.json().status);
            return response.json().status;

        }
    }
    handleCustomError(error: Response | any) {
        return Observable.throw(error.json());
    }
    handleError(response: Response) {
        return response.json();
    }
}