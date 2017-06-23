import {Component} from '@angular/core';
import {DashboardHttpServices} from '../http-service/http-service.service';

@Component({
    selector: 'alerts-notifications',
    templateUrl: './alerts-notifications.component.html',
})
export class AlertsNotificationComponent{
constructor (private dashboardHttpServices: DashboardHttpServices){}
profile: any;
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