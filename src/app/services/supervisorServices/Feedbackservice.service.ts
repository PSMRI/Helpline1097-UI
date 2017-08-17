import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
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
    // private _feedbackListURL: string = "http://10.152.3.152:1040/Helpline-104-API/grievance/getFeedback"
    // private _updateurl: string = "http://10.152.3.152:1040/Helpline-104-API/grievance/updateFeedback"
    // //  private _updateurl:string="http://localhost:8080/Helpline-104-API/grievance/updateFeedback"
    // private _statusurl: string = "http://10.152.3.152:1040/Helpline-104-API/grievance/updateFeedbackStatus"
    // private _searchurl: string = "http://10.152.3.152:1040/Helpline-104-API/grievance/searchFeedback1"
    // private _responurl: string = "http://10.152.3.152:1040/Helpline-104-API/grievance/responceFeedback"
    // private _responceurl: string = "http://10.152.3.152:1040/Helpline-104-API/grievance/getAllFeedbackById1"

    // private _feedbackListURL: string = this._config.getCommonBaseURL() + "feedback/getFeedback"
    // private _requestFeedbackURL: string = this._config.getCommonBaseURL() + "feedback/updateFeedback"
    //  private _updateurl:string=this._config.getCommonBaseURL()+"feedback/updateFeedback"
    // private _statusurl: string = this._config.getCommonBaseURL() + "feedback/updateFeedbackStatus"
    // private _searchurl: string = this._config.getCommonBaseURL() + "feedback/searchFeedback1"
    // private _responurl: string = this._config.getCommonBaseURL() + "feedback/responceFeedback"
    // private _responceurl: string = this._config.getCommonBaseURL() + "feedback/getAllFeedbackById1"


    constructor(
        private _http: Http,
        private _config: ConfigService,
        private httpIterceptor: InterceptedHttp
    ) { }
    getFeedback(data: any) {

        return this.httpIterceptor.post(this._feedbackListURL, data).map(this.handleSuccess).catch(this.handleError);
        // .map(( response: Response ) => response.json() );

    }

    getFeedbackStatuses() {
        let data = {};
        return this._http.post(this._getFeedbackStatus, data, this.options).map(this.handleSuccess).catch(this.handleError);
        // .map(( response: Response ) => response.json() );

    }

    getEmailStatuses() {
        let data = {};
        return this._http.post(this._getEmailStatus, data, this.options).map(this.handleSuccess).catch(this.handleError);
        // .map(( response: Response ) => response.json() );

    }

    requestFeedback(data: any) {

        //console.log(data);
        return this._http.post(this._requestFeedbackURL, data, this.options).map(this.handleSuccess).catch(this.handleError);

        // .map(( response: Response ) => response.json() );

    }
    // updateStatus ( sdata: any )
    // {
    //     return this._http.post( this._statusurl, sdata, this.options ).map( this.handleSuccess ).catch( this.handleError );
    //     // .map(( response: Response ) => response.json() );
    // }
    // searchFeedback ( searchdata: any )
    // {

    //     return this._http.post( this._searchurl, searchdata, this.options ).map( this.handleSuccess ).catch( this.handleError );
    //     // .map(( response: Response ) => response.json() );

    // }
    updateResponce(resData: any) {
        return this._http.post(this._updateResponseURL, resData, this.options).map(this.handleSuccess).catch(this.handleError);
        // .map(( response: Response ) => response.json() );

    }


    // responce ( responce: any )
    // {
    //     return this._http.post( this._responceurl, responce, this.options ).map( this.handleSuccess ).catch( this.handleError );
    //     // .map(( response: Response ) => response.json() );

    // }

    handleSuccess(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return response.json();
        }
    }

    handleError(response: Response) {
        return response.json();
    }
}