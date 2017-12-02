import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MdDialog } from '@angular/material';

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


	constructor(private dataService: dataService,
	            private notificationService: NotificationService,
	            public dialog: MdDialog) { };

	ngOnInit() {
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