import {Component, OnInit} from '@angular/core';
import {DashboardHttpServices} from '../http-service/http-service.service';
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MdDialog } from '@angular/material';

@Component({
    selector: 'alerts-notifications',
    templateUrl: './alerts-notifications.component.html',
})
export class AlertsNotificationComponent implements OnInit{
role: any;
service: any;
profile: any;
alertConfig : any;
notificationConfig : any;
alerts: any;
notifications: any;
alertPostData: any;
notificationPostData: any;
constructor (private dashboardHttpServices: DashboardHttpServices, private dataService: dataService, private notificationService : NotificationService, public dialog: MdDialog){}


ngOnInit(){
    this.role = this.dataService.current_role;
    this.service = this.dataService.current_service;
    console.log("providerServiceMapID"+this.service.serviceID);
    this.notificationService.getNotificationTypes(this.service.serviceID)
    .subscribe((response)=> {
        console.log(response);
        this.alertConfig = response.data.filter((notification)=>{
            return notification.notificationType=="Alert";
        });
        console.log(this.alertConfig);
        this.alertPostData = {
            "providerServiceMapID": this.service.serviceID,
            "notificationTypeID": this.alertConfig[0].notificationTypeID,
            "roleIDs": [this.role.RoleID],
            "validFrom": new Date().toISOString(),
            "validTill": new Date(Date.now()+7*24*60*60*1000).toISOString()
        };
        this.notificationConfig = response.data.filter((notification)=>{
            return notification.notificationType=="Notification";
        });
        console.log(this.notificationConfig);
        this.notificationPostData = {
            "providerServiceMapID": this.service.serviceID,
            "notificationTypeID": this.notificationConfig[0].notificationTypeID,
            "roleIDs": [this.role.RoleID],
            "validFrom": new Date().toISOString(),
            "validTill": new Date(Date.now()+7*24*60*60*1000).toISOString()
        }
        this.getAlertsandNotifications();
    },
    (err)=>{
        console.log(err);
    });
    
    
}
loadAlertsAndNotifications(actor: string){
    var url;
    if(actor === 'CO'){
        url = "http://localhost:8080/DashboardWebServiceNew/RestAPI/dbrdService/data/query=CC&mainPage";
        this.dashboardHttpServices.getData(url
        ).subscribe(data => this.profile = data);
        console.log(this.profile);
    }else
        alert("Not CO...");
    }

getAlertsandNotifications(){
    console.log(this.alertPostData);
    console.log(this.notificationPostData);
    this.notificationService.getAlerts(this.alertPostData)
    .subscribe((response)=>{
        console.log(response);
        this.alerts = response.data;
    },
    (err)=>{
        console.log(err);
    });
    this.notificationService.getNotifications(this.notificationPostData)
    .subscribe((response)=>{
        console.log(response);
        this.notifications = response.data;
    },
    (err)=>{
        console.log(err);
    });
}

alertClicked(alert, event){
    event.preventDefault();
    console.log(alert.notificationDesc);
    let dialog = this.dialog.open(MessageDialogComponent, {
        data: {
            message: alert.notificationDesc,
            type: "Alert"
        }
      });
}

notificationClicked(notification,event){
    event.preventDefault();
    console.log(notification.notificationDesc);
    let dialog = this.dialog.open(MessageDialogComponent, {
        data: {
            message: notification.notificationDesc,
            type: "Alert"
        }
      });
}

}