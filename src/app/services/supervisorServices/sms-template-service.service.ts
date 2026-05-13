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
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';
import { dataService } from '../dataService/data.service';


@Injectable()
export class SmsTemplateService {

    commonBaseURL: any;

    getSMStemplates_url: any;
    saveSMStemplate_url: any;
    updateSMStemplate_url: any;

    getSMStypes_url: any;
    getSMSparameters_url: any;

    getFullSMSTemplate_url: any;
    sendSMS_url: any;

    constructor(
        private _config: ConfigService,
        private dataService:dataService,
        private httpIntercept: InterceptedHttp) {
        this.commonBaseURL = this._config.getCommonBaseURL();

        this.getSMStemplates_url = this.commonBaseURL + 'sms/getSMSTemplates';
        this.saveSMStemplate_url = this.commonBaseURL + 'sms/saveSMSTemplate';
        this.updateSMStemplate_url = this.commonBaseURL + 'sms/updateSMSTemplate';

        this.getSMStypes_url = this.commonBaseURL + 'sms/getSMSTypes';
        this.getSMSparameters_url = this.commonBaseURL + 'sms/getSMSParameters';
        this.getFullSMSTemplate_url = this.commonBaseURL + 'sms/getFullSMSTemplate';
        this.sendSMS_url = this.commonBaseURL + 'sms/sendSMS';


    }

    getSMStemplates(providerServiceMapID, smsTypeID?) {
        return this.httpIntercept.post(this.getSMStemplates_url,
            {
                'providerServiceMapID': providerServiceMapID,
                'smsTemplateTypeID': smsTypeID ? smsTypeID : undefined
            }).pipe(
            map(this.handleSuccess),
            catchError(this.handleError));
    }

    getFullSMSTemplate(providerServiceMapID, smsTemplateID) {
        return this.httpIntercept.post(this.getFullSMSTemplate_url,
            {
                'providerServiceMapID': providerServiceMapID,
                'smsTemplateID': smsTemplateID
            }).pipe(
            map(this.handleSuccess),
            catchError(this.handleError));
    }


    getSMStypes(serviceID) {
        return this.httpIntercept.post(this.getSMStypes_url,
            { 'serviceID': serviceID }).pipe(
            map(this.handleSuccess),
            catchError(this.handleError));
    }

    getSMSparameters() {
        return this.httpIntercept.post(this.getSMSparameters_url,
            { 'serviceID': this.dataService.current_serviceID?this.dataService.current_serviceID:1 } 
).pipe(
            map(this.handleSuccess),
            catchError(this.handleError));
    }

    saveSMStemplate(obj) {
        return this.httpIntercept.post(this.saveSMStemplate_url, obj).pipe(
            map(this.handleSuccess),
            catchError(this.handleError));
    }

    updateSMStemplate(obj) {
        return this.httpIntercept.post(this.updateSMStemplate_url, obj).pipe(
            map(this.handleSuccess),
            catchError(this.handleError));
    }

    sendSMS(obj) {
        return this.httpIntercept.post(this.sendSMS_url, obj).pipe(
            map(this.handleSuccess),
            catchError(this.handleError));
    }



    handleSuccess(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return _throw(response.json());
        }
    }

    private handleError(error: Response | any) {
        return _throw(error.json());
    };

}