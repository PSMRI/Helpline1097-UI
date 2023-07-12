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


import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MdDialog } from '@angular/material';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
	selector: 'news-informations',
	templateUrl: './news-informations.component.html',
})
export class NewsInformationsComponent implements OnInit {
	@Output() hide_component: EventEmitter<any> = new EventEmitter<any>();
	providerServiceMapID:any;
	
	emergency_alertID:any;

	request_object:any;

	currentDate:any;

	emrMessages=[];
	currentLanguageSet: any;


	constructor(private dataService: dataService,
	            private notificationService: NotificationService,
	            public dialog: MdDialog,public HttpServices: HttpServices) { };

	ngOnInit() {
		this.assignSelectedLanguage();
		this.providerServiceMapID=this.dataService.current_service.serviceID;

		this.currentDate=new Date();

		this.request_object={
			"providerServiceMapID": this.providerServiceMapID,
			"notificationTypeID":"",
			"validFrom": this.currentDate,
			"validTill": this.currentDate
		}

		/*callthe function to get the call type for User related alerts here*/
		this.notificationService.getNotificationTypes(this.providerServiceMapID)
		.subscribe(response=>this.getNotificationTypesSuccessHandeler(response));
	};
	ngDoCheck() {
		this.assignSelectedLanguage();
	  }
	  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

	getNotificationTypesSuccessHandeler(response)
	{
		console.log("alertTypes",response);

		for(let i=0;i<response.data.length;i++)
		{
			if(response.data[i].notificationType==="Emergency Contact")
			{
				this.emergency_alertID=response.data[i].notificationTypeID;
			}

		}


		/*  once we have the userID of current user and the alert_type_IDs related to User, now we
		will call the api to get the alerts  */

		this.getEmergencyAlerts(this.emergency_alertID);
	}

	getEmergencyAlerts(notificationID)
	{
		let obj=Object.assign({},this.request_object);
		obj['notificationTypeID']=notificationID;
		
		console.log("the request obj is",obj);
		this.notificationService.getAlerts(obj).subscribe(response=>this.getEmergencyAlertsSuccessHandeler(response))
	}

	getEmergencyAlertsSuccessHandeler(response)
	{
		console.log("Emergency ALERTS",response);
		this.emrMessages=response.data;
	}

	close() {
		this.hide_component.emit('5');
	}

	getOffsetTime() {
		let date = new Date();
		return new Date((date.getTime() - 1 * (date.getTimezoneOffset() * 60 * 1000)));
	}

	alertClicked(alert, event) {
		event.preventDefault();
		let dialog = this.dialog.open(MessageDialogComponent, {
			width: '400px',
			height: '300px',
			disableClose: true,
			data: {
				message: alert.notificationDesc,
				type: "Message",
				kmFilePath: alert.kmFilePath
			}
		});
	}
}