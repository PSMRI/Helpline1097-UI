import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';

@Injectable()
export class SmsTemplateService {

    commonBaseURL: any;

    getSMStemplates_url: any;
    saveSMStemplate_url: any;
    updateSMStemplate_url: any;

    getSMStypes_url: any;
    getSMSparameters_url: any;

    constructor(
        private _config: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.commonBaseURL = this._config.getCommonBaseURL();

        this.getSMStemplates_url = this.commonBaseURL + 'sms/getSMSTemplates';
        this.saveSMStemplate_url = this.commonBaseURL + 'sms/saveSMSTemplate';
        this.updateSMStemplate_url = this.commonBaseURL + 'sms/updateSMSTemplate';

        this.getSMStypes_url = this.commonBaseURL + 'sms/getSMSTypes';
        this.getSMSparameters_url = this.commonBaseURL + 'sms/getSMSParameters';


    }

    getSMStemplates(providerServiceMapID) {
        return this.httpIntercept.post(this.getSMStemplates_url,
            { 'providerServiceMapID': providerServiceMapID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getSMStypes(serviceID) {
        return this.httpIntercept.post(this.getSMStypes_url,
            { 'serviceID': serviceID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getSMSparameters() {
        return this.httpIntercept.post(this.getSMSparameters_url,
            {})
            .map(this.handleSuccess)
            .catch(this.handleError);
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