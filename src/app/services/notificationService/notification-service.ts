import { Injectable } from '@angular/core';

import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from './../../http.interceptor'


@Injectable()
export class NotificationService {

    getNotificationTypesURL = this.configService.getCommonBaseURL() + "notification/getNotificationType";
    getRolesURL = this.configService.getCommonBaseURL() + 'user/getRolesByProviderID';
    createNotificationURL = this.configService.getCommonBaseURL() + 'notification/createNotification';
    getNotificationsURL = this.configService.getCommonBaseURL() + "notification/getNotification";
    getSupervisorNotificationsURL = this.configService.getCommonBaseURL() + "notification/getSupervisorNotification";
    updateNotificationURL = this.configService.getCommonBaseURL() + "notification/updateNotification";

    headers = new Headers(
        { 'Content-Type': 'application/json' }
    );

    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private configService: ConfigService, private httpIntercepto: InterceptedHttp) { };

    ngOnInit() {

    }

    getNotificationTypes(providerServiceMapID) {
        let data = { "providerServiceMapID": providerServiceMapID };
        return this.http.post(this.getNotificationTypesURL, data, this.options)
            .map((response: Response) => response.json());
    }
    getRoles(providerServiceMapID) {
        let data = { "providerServiceMapID": providerServiceMapID };
        return this.http.post(this.getRolesURL, data, this.options)
            .map((response: Response) => response.json());
    }
    createNotification(data) {
        return this.http.post(this.createNotificationURL, data, this.options)
            .map((response: Response) => response.json());
    }
    getAlerts(data) {
        return this.http.post(this.getNotificationsURL, data, this.options)
            .map((response: Response) => response.json());
    }
    getNotifications(data) {
        return this.http.post(this.getNotificationsURL, data, this.options)
            .map((response: Response) => response.json());
    }
    getKMs(data) {
        return this.http.post(this.getNotificationsURL, data, this.options)
            .map((response: Response) => response.json());
    }
    getSupervisorNotifications(data) {
        return this.httpIntercepto.post(this.getSupervisorNotificationsURL, data)
            .map((response: Response) => response.json()).catch(this.handleError);
    }
    updateNotification(data) {
        return this.httpIntercepto.post(this.updateNotificationURL, data, this.options)
            .map((response: Response) => response.json()).catch(this.handleError);
    }
    handleError(error: Response) {
        return Observable.throw(error.json());
    }
}