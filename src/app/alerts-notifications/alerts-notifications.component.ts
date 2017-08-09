import {Component, OnInit} from '@angular/core';
import {DashboardHttpServices} from '../http-service/http-service.service';
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';

@Component({
    selector: 'alerts-notifications',
    templateUrl: './alerts-notifications.component.html',
})
export class AlertsNotificationComponent implements OnInit{
role: any;
service: any;
profile: any;
alerts: any;
notifications: any;
constructor (private dashboardHttpServices: DashboardHttpServices, private dataService: dataService, private notificationService : NotificationService){}


ngOnInit(){
    this.role = this.dataService.current_role;
    this.service = this.dataService.current_service;
    let data = { 'providerServiceMapID': this.service.serviceID};
    this.notificationService.getNotificationTypes(data)
    .subscribe((response)=> {
        console.log(response);
        this.alerts = response.filter((notification)=>{
            return notification.notificationType=="Alert";
        });
        console.log(this.alerts);
        this.notifications = response.filter((notification)=>{
            return notification.notificationType=="Notification";
        });
        console.log(this.notifications);
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
}