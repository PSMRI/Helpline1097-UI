import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DashboardHttpServices } from '../http-service/http-service.service';
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MdDialog } from '@angular/material';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'

@Component({
  selector: 'alerts-notifications',
  templateUrl: './alerts-notifications.component.html',
})
export class AlertsNotificationComponent implements OnInit {
  role: any;
  service: any;
  profile: any;

  alertConfig: any;
  notificationConfig: any;
  languageConfig:any;
  locationConfig:any;

  alerts: any=[];
  notifications: any=[];
  languageAlerts:any=[];
  locationAlerts:any=[];

  alertPostData: any;
  notificationPostData: any;
  languagePostData:any;
  locationPostData:any;

  providerServiceMapID:any;

  languageIDs:any=[];
  officeIDs:any=[];

  current_userData:any;

  @Output() hide_component: EventEmitter<any> = new EventEmitter<any>();
  constructor(private dashboardHttpServices: DashboardHttpServices, public alertService: ConfirmationDialogsService,
              private dataService: dataService,
              private notificationService: NotificationService,
              public dialog: MdDialog) { }


  ngOnInit() {
    this.role = this.dataService.current_role;
    this.service = this.dataService.current_service;

    this.providerServiceMapID=this.service.serviceID;

    this.current_userData=this.dataService.Userdata;
    this.setLanguageIDs(this.current_userData.m_UserLangMappings);

    console.log("providerServiceMapID" + this.service.serviceID);
    
    this.notificationService.getNotificationTypes(this.service.serviceID)
    .subscribe((response) => {
      let currentDate =new Date();
      console.log(response.data,"notification Types in dashboard Alert component");
      // "Language Message"
      // "Location Message"
      this.alertConfig = response.data.filter((notification) => {
        return notification.notificationType == "Alert";
      });

      if (this.alertConfig.length > 0) {
        this.alertPostData = {
          "providerServiceMapID": this.service.serviceID,
          "notificationTypeID": this.alertConfig[0].notificationTypeID,
          "roleIDs": [this.role.RoleID],
          "validFrom": currentDate,
          "validTill": currentDate
        };

      }
      

      this.notificationConfig = response.data.filter((notification) => {
        return notification.notificationType == "Notification";
      });
      if (this.notificationConfig.length > 0) {
        this.notificationPostData = {
          "providerServiceMapID": this.service.serviceID,
          "notificationTypeID": this.notificationConfig[0].notificationTypeID,
          "roleIDs": [this.role.RoleID],
          "validFrom": currentDate,
          "validTill": currentDate
        };



        this.languageConfig = response.data.filter((notification) => {
          return notification.notificationType == "Language Message";
        });

        if (this.languageConfig.length > 0) {
          this.languagePostData = {
            "providerServiceMapID": this.service.serviceID,
            "notificationTypeID": this.languageConfig[0].notificationTypeID,
            "languageIDs": this.languageIDs,
            "validFrom": currentDate,
            "validTill": currentDate
          };

        }

        this.locationConfig = response.data.filter((notification) => {
          return notification.notificationType == "Location Message";
        });

        if (this.locationConfig.length > 0) {
          this.locationPostData = {
            "providerServiceMapID": this.service.serviceID,
            "notificationTypeID": this.locationConfig[0].notificationTypeID,
            "workingLocationIDs": [this.role.workingLocationID],
            "validFrom": currentDate,
            "validTill": currentDate
          };

        }
      }
      this.getAlertsandNotifications();
    },
    (err) => {
      this.alertService.alert(err.errorMessage);
      console.log(err);
    });
  }

  

  getAlertsandNotifications() {
    if (this.alertPostData) {
      console.log(this.alertPostData);
      this.notificationService.getAlerts(this.alertPostData)
      .subscribe((response) => {
        console.log(response);
        this.alerts = response.data;
      },
      (err) => {
        this.alertService.alert(err.errorMessage,'error');

        console.log(err);
      });
    }
    if (this.notificationPostData) {
      console.log(this.notificationPostData);
      this.notificationService.getNotifications(this.notificationPostData)
      .subscribe((response) => {
        console.log(response);
        this.notifications = response.data;
      },
      (err) => {
        this.alertService.alert(err.errorMessage,'error');

        console.log(err);
      });
    }

    if (this.languagePostData) {
      console.log(this.languagePostData,"Request object before api hit in language");
      this.notificationService.getAlerts(this.languagePostData)
      .subscribe((response) => {
        console.log(response,"LANGUAGE ALERTS");
        this.languageAlerts= response.data;
      },
      (err) => {
        this.alertService.alert(err.errorMessage,'error');

        console.log(err);
      });
    }

    if (this.locationPostData) {
      console.log(this.locationPostData,"Request object before api hit in Location");
      this.notificationService.getAlerts(this.locationPostData)
      .subscribe((response) => {
        console.log(response,"LOCATION ALERTS");
        this.locationAlerts= response.data;
      },
      (err) => {
        this.alertService.alert(err.errorMessage,'error');

        console.log(err);
      });
    }

  }

  alertClicked(alert, event) {
    event.preventDefault();
    let dialog = this.dialog.open(MessageDialogComponent, {
     width: '400px',
     disableClose : true,
    //  height: '250px',
     data: {
      message: alert.notificationDesc,
      type: "Alert",
      kmFilePath: alert.kmFilePath
    }
  });
  }

  notificationClicked(notification, event) {
    event.preventDefault();
    let dialog = this.dialog.open(MessageDialogComponent, {
      width: '400px',
      disableClose : true,
      // height: '250px',
      data: {
        message: notification.notificationDesc,
        type: "Notification",
        kmFilePath: notification.kmFilePath
      }

    });
  }

  setLanguageIDs(languageArray)
  {
    console.log("Language skill set array",languageArray);
    // languageID
    for(let j=0;j<languageArray.length;j++)
    {
      this.languageIDs.push(languageArray[j].languageID);
    }
  }

  close() {
    this.hide_component.emit("3");
  };

  getOffsetTime() {
    let date = new Date();
    return new Date((date.getTime() - 1 * (date.getTimezoneOffset() * 60 * 1000)));
  }
}