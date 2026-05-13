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

import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config/config.service';
import { map, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import { InterceptedHttp } from './../../http.interceptor';
import { AuthorizationWrapper } from './../../authorization.wrapper';
import { SocketService } from '../socketService/socket.service';


@Injectable()
export class NotificationService {

    getNotificationTypesURL = this.configService.getCommonBaseURL() + 'notification/getNotificationType';
    getRolesURL = this.configService.getCommonBaseURL() + 'user/getRolesByProviderID';
    saveEverwellGuidelinesURL=this.configService.get1097BaseURL()+'saveEverwellGuidelines';
    deleteEverwellGuidelinesURL=this.configService.get1097BaseURL()+'deleteEverwellGuidelines';
    fetchEverwellGuidelinesURL=this.configService.get1097BaseURL()+'fetchEverwellGuidelines';
    createNotificationURL = this.configService.getCommonBaseURL() + 'notification/createNotification';
    getNotificationsURL = this.configService.getCommonBaseURL() + 'notification/getNotification';
    getSupervisorNotificationsURL = this.configService.getCommonBaseURL() + 'notification/getSupervisorNotification';
    updateNotificationURL = this.configService.getCommonBaseURL() + 'notification/updateNotification';
    getOfficesFromRole_URL = this.configService.getCommonBaseURL() + "user/getLocationsByProviderID";

    getLanguagesURL = this.configService.getCommonBaseURL() + 'beneficiary/getRegistrationData';
    getOfficesURL = this.configService.getAdminBaseUrl() + 'm/location/getAlllocationNew';
    getUsersByProviderID_URL = this.configService.getCommonBaseURL() + 'user/getUsersByProviderID';
    getServiceProviderID_url = this.configService.getAdminBaseUrl() + 'getServiceProviderid';
    sendSocketNotification_url = this.socketService.getSocketURL() + 'notification/notificationToRoom';
    getDesignationsUrl = this.configService.getAdminBaseUrl() + 'm/getDesignation';
    getSupervisorEmergencyContacts_url = this.configService.getCommonBaseURL() + 'notification/getSupervisorEmergencyContacts';
    createEmergencyContacts_url = this.configService.getCommonBaseURL() + 'notification/createEmergencyContacts';
    updateEmergencyContacts_url = this.configService.getCommonBaseURL() + 'notification/updateEmergencyContacts';
    getCount_url = this.configService.getCommonBaseURL() + 'notification/getAlertsAndNotificationCount';
    getNotificationDetails_url = this.configService.getCommonBaseURL() + 'notification/getAlertsAndNotificationDetail';
    changeNotificationStatus_url = this.configService.getCommonBaseURL() + 'notification/changeNotificationStatus';
    deleteNotification_url = this.configService.getCommonBaseURL() + 'notification/markDelete';
    getEmergencyContacts_Url = this.configService.getCommonBaseURL() +'notification/getEmergencyContacts';

    constructor(public socketService: SocketService, private http: AuthorizationWrapper, private configService: ConfigService, private httpIntercepto: InterceptedHttp) { };

    getUsersByProviderID(psmID) {
        return this.http.post(this.getUsersByProviderID_URL, { 'providerServiceMapID': psmID }).pipe(
            map((response: Response) => response.json().data));
    }

    getLanguages() {
        return this.http.post(this.getLanguagesURL, {}).pipe(
            map((response: Response) => response.json().data.m_language));
    }

    getOffices(psmID) {
        console.log(psmID);
        return this.httpIntercepto.post(this.getOfficesURL, {
           'providerServiceMapID': psmID
        })
            .pipe(map((response: Response) => response.json().data));
    }

    getServiceProviderID(providerServiceMapID) {
        return this.http.post(this.getServiceProviderID_url, { 'providerServiceMapID': providerServiceMapID }).pipe(
            map((response: Response) => response.json().data));
    }
    getAllDesignations() {
        return this.http.post(this.getDesignationsUrl, {}).pipe(
            map((response: Response) => response.json().data));
    }
    getNotificationTypes(providerServiceMapID) {
        let data = { 'providerServiceMapID': providerServiceMapID };
        return this.http.post(this.getNotificationTypesURL, data).pipe(
            map((response: Response) => response.json()));
    }
    getRoles(providerServiceMapID) {
        let data = { 'providerServiceMapID': providerServiceMapID };
        return this.http.post(this.getRolesURL, data).pipe(
            map((response: Response) => response.json()));
    }
    createNotification(data) {
        return this.httpIntercepto.post(this.createNotificationURL, data).pipe(
            map((response: Response) => response.json()));
    }
    getAlerts(data) {
        return this.http.post(this.getNotificationsURL, data).pipe(
            map((response: Response) => response.json()));
    }
    getOfficeByRole(providerServiceMapID, roleID) {
        return this.http.post(this.getOfficesFromRole_URL, {
            "providerServiceMapID": providerServiceMapID,
            "roleID": roleID
        }).pipe(
            map((response: Response) => response.json().data));
    }
    getNotifications(data) {
        return this.http.post(this.getNotificationsURL, data).pipe(
            map((response: Response) => response.json()));
    }
    getKMs(data) {
        return this.http.post(this.getNotificationsURL, data).pipe(
            map((response: Response) => response.json()));
    }
    getSupervisorNotifications(data) {
        return this.httpIntercepto.post(this.getSupervisorNotificationsURL, data).pipe(
            map((response: Response) => response.json()), catchError(this.handleCustomError));
    }
    updateNotification(data) {
        return this.httpIntercepto.post(this.updateNotificationURL, data).pipe(
            map((response: Response) => response.json()), catchError(this.handleCustomError));
    }
    getSupervisorEmergencyContacts(data) {
        return this.httpIntercepto.post(this.getSupervisorEmergencyContacts_url, data).pipe(
            map((response: Response) => response.json()), catchError(this.handleCustomError));
    }
    getCount(data){
        return this.httpIntercepto.post(this.getCount_url, data).pipe(
            map((response: Response) => response.json()), catchError(this.handleCustomError));
    }    
    getNotificationDetails(data){
        return this.httpIntercepto.post(this.getNotificationDetails_url, data).pipe(
            map((response: Response) => response.json()), catchError(this.handleCustomError));
    }
    changeNotificationStatus(data){
        return this.httpIntercepto.post(this.changeNotificationStatus_url, data).pipe(
            map((response: Response) => response.json()), catchError(this.handleCustomError));
    }
    deleteNotification(data){
        return this.httpIntercepto.post(this.deleteNotification_url, data).pipe(
            map((response: Response) => response.json()), catchError(this.handleCustomError));
    }
    createEmergencyContacts(data) {
        return this.httpIntercepto.postEverwell(this.createEmergencyContacts_url, data).pipe(
            map((response: Response) => response.json()), catchError(this.handleCustomError));
    }
    sendSocketNotification(data) {
        return this.http.post(this.sendSocketNotification_url, data).pipe(
            map((response: Response) => response.json()), catchError(this.handleCustomError));
    }
    updateEmergencyContacts(data) {
        return this.httpIntercepto.postEverwell(this.updateEmergencyContacts_url, data).pipe(
            map((response: Response) => response.json()), catchError(this.handleCustomError));
    }
    updateEmergencyContactsActivateDeactivate(data) {
        return this.httpIntercepto.postEverwell(this.updateEmergencyContacts_url, data).pipe(
            map((response: Response) => response.json()), catchError(this.handleCustomError));
    }
    getEmergencyContacts(data) {
        return this.httpIntercepto.post(this.getEmergencyContacts_Url,data).pipe(
        map((response : Response )=> response.json().data), catchError(this.handleCustomError));
    }
    handleError(error: Response) {
        return _throw(error.json());
    }
    handleCustomError(error: Response) {
        return _throw(error.json());
    }
    saveGuidelines(data) {
        return this.httpIntercepto.post(this.saveEverwellGuidelinesURL, data).pipe(
        map((response: Response) => response.json()), catchError(this.handleCustomError));
    }
    deleteGuidelines(data) {
        return this.httpIntercepto.post(this.deleteEverwellGuidelinesURL, data).pipe(
        map((response: Response) => response.json()), catchError(this.handleCustomError));
    }
    fetchGuidelines(data) {
        return this.httpIntercepto.post(this.fetchEverwellGuidelinesURL, data).pipe(
        map((response: Response) => response.json()), catchError(this.handleCustomError));
    }

}