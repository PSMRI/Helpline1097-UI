import { Component, OnInit, Output, EventEmitter, Inject, Input } from '@angular/core';
import { DashboardHttpServices } from '../http-service/http-service.service';
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'alerts-notifications',
  templateUrl: './alerts-notifications.component.html',
  styleUrls: ['./alerts-notifications.component.css']
})
export class AlertsNotificationComponent implements OnInit {


  userId: any;
  providerServiceMapID: any;
  roleId: any;
  workingLocationID: any;

  alertCount: any = 0;
  notificationCount: any = 0;
  othersCount: any = 0;

  alertConfig: any;
  notificationConfig: any;
  othersConfig: any;
  @Input() alertRefresh: number;

  constructor(private dashboardHttpServices: DashboardHttpServices,
    private dataService: dataService,
    private notificationService: NotificationService,
    public dialog: MdDialog, private alertService: ConfirmationDialogsService) { }


  ngOnInit() {

    this.userId = this.dataService.uid;
    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.roleId = this.dataService.current_role.RoleID;
    this.workingLocationID = this.dataService.current_workingLocationID;
    this.getCount();

    // this.roleID = this.dataService.current_roleID;
    // this.workingLocationID = this.dataService.current_workingLocationID;
    // this.service = this.dataService.current_service;

    // this.providerServiceMapID=this.service.serviceID;

    // this.current_userData=this.dataService.Userdata;
    // this.setLanguageIDs(this.current_userData.m_UserLangMappings);

    // console.log("providerServiceMapID" + this.service.serviceID);

    this.notificationService.getNotificationTypes(this.providerServiceMapID)
      .subscribe((response) => {
        console.log(response, "notification Types in dashboard Alert component");
        if (response) {
          this.alertConfig = response.data.filter((notification) => {
            return notification.notificationType == "Alert";
          });

          this.notificationConfig = response.data.filter((notification) => {
            return notification.notificationType == "Notification";
          });

          this.othersConfig = response.data.filter((notification) => {
            return notification.notificationType == "Location Message";
          });
        }
      },
      (err) => {
        console.log(err);
      });
  }

  getCount() {
    this.notificationService.getCount({
      'userID': this.userId,
      'roleID': this.roleId,
      'providerServiceMapID': this.providerServiceMapID
    }).subscribe((response) => {
      console.log("count api response", response.data);
      if (response.data.userNotificationTypeList.length > 0) {
        let alertObj = response.data.userNotificationTypeList.filter((item) => {
          return item.notificationType == 'Alert';
        });
        let othersObj = response.data.userNotificationTypeList.filter((item) => {
          return item.notificationType == 'Location Message';
        });
        let notificationObj = response.data.userNotificationTypeList.filter((item) => {
          return item.notificationType == 'Notification';
        });
        if (alertObj.length > 0) {
          this.alertCount = alertObj[0].notificationTypeUnreadCount;
        }
        else {
          this.alertCount = 0;
        }
        if (othersObj.length > 0) {
          this.othersCount = othersObj[0].notificationTypeUnreadCount;
        }
        else {
          this.othersCount = 0;
        }
        if (notificationObj.length > 0) {
          this.notificationCount = notificationObj[0].notificationTypeUnreadCount;
        }
        else {
          this.notificationCount = 0;
        }
        console.log("alertCount:", this.alertCount, "othersCount:", this.othersCount, "notificationCount:", this.notificationCount);
      }
      else {
        this.alertCount = 0;
        this.notificationCount = 0;
        this.othersCount = 0;
      }
    },
      (error) => {
        console.log(error);
      })
  }

  ngOnChanges() {
    if (this.alertRefresh > 1) {
      this.getCount();
    }
  }


  openNotificationsDialog(messages_type) {

    let notificationTypeId;

    if (messages_type == 'Alert') {
      notificationTypeId = this.alertConfig[0].notificationTypeID;
    }
    else if (messages_type == 'Notification') {
      notificationTypeId = this.notificationConfig[0].notificationTypeID;
    }
    else {
      notificationTypeId = this.othersConfig[0].notificationTypeID;
    }

    let messages = [];

    this.notificationService.getNotificationDetails({
      "userID": this.userId,
      "roleID": this.roleId,
      "notificationTypeID": notificationTypeId,
      "providerServiceMapID": this.providerServiceMapID
    }).subscribe((response) => {
      console.log(response.data, "notification details api response");
      messages = response.data;
      messages = messages.filter((item) => item.notificationState != 'future');
      if (messages.length > 0) {
        let dialogRef = this.dialog.open(AlertsNotificationsDialogComponent, {
          width: '600px',
          // height: '500px',
          disableClose: true,
          data: {
            'msg_type': messages_type,
            'messages': messages,
            "notificationTypeID": notificationTypeId
          }
        });

        dialogRef.afterClosed()
          .subscribe((response) => {
            this.getCount();
          },
          (error) => {
            console.log(error);
          });
      }
      else {
        this.alertService.alert('No ' + messages_type.toLowerCase() + ' messages found');
      }
    },
      (error) => {
        console.log(error);
      });
  }

}


@Component({
  selector: 'app-alerts-notifications-dialog',
  templateUrl: './alerts-notifications-dialog.html',
  styleUrls: ['./alerts-notifications.component.css']

})
export class AlertsNotificationsDialogComponent {

  messages: any = [];
  heading: any;
  notificationTypeID: any;
  notificationIDArray: any = [];

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<AlertsNotificationsDialogComponent>,
    private notificationService: NotificationService,
    private dataService: dataService, private alertService: ConfirmationDialogsService) {
    this.initialize(this.data);
  }

  initialize(data) {
    this.messages = data.messages;
    this.heading = data.msg_type;
    this.notificationTypeID = data.notificationTypeID;
    this.messages.map((item) => {
      this.notificationIDArray.push(item.userNotificationMapID);
    }, this);
  }

  unreadAll() {
    console.log("call api and on success re initialize messages");
    this.notificationService.changeNotificationStatus({
      "notficationStatus": "unread",
      "userNotificationMapIDList": this.notificationIDArray
    }).subscribe((response) => {
      console.log(response.data, "unread all api response");
      if (response.data.status == 'success')
        this.reInitialize();
    },
      (error) => {
        console.log(error);
      });
  }

  readAll() {
    console.log("call api and on success re initialize messages");
    this.notificationService.changeNotificationStatus({
      "notficationStatus": "read",
      "userNotificationMapIDList": this.notificationIDArray
    }).subscribe((response) => {
      console.log(response.data, "read all api response");
      if (response.data.status == 'success')
        this.reInitialize();
    },
      (error) => {
        console.log(error);
      });
  }
  unreadSingle(id) {
    let notificationIDArray = [id];
    this.notificationService.changeNotificationStatus({
      "notficationStatus": "unread",
      "userNotificationMapIDList": notificationIDArray
    }).subscribe((response) => {
      if (response.data.status == 'success')
        this.reInitialize();
    },
      (error) => {
        console.log(error);
      });
  }
  readSingle(id) {
    let notificationIDArray = [id];
    this.notificationService.changeNotificationStatus({
      "notficationStatus": "read",
      "userNotificationMapIDList": notificationIDArray
    }).subscribe((response) => {
      if (response.data.status == 'success')
        this.reInitialize();
    },
      (error) => {
        console.log(error);
      });
  }
  deleteNotification(id) {
    console.log(id, "use id and call api, on success re initialize messages");
    this.alertService.confirm('', 'Are you sure you want to delete?')
      .subscribe((res) => {
        if (res) {
          this.notificationService.deleteNotification({
            "isDeleted": true,
            "userNotificationMapIDList": [
              id
            ]
          }).subscribe((response) => {
            console.log(response.data, "delete notification api response");
            if (response.data.status == 'success')
              this.reInitialize();
          },
            (error) => {
              console.log(error);
            });
        }
      });
  }

  reInitialize() {
    this.notificationService.getNotificationDetails({
      "userID": this.dataService.uid,
      "roleID": this.dataService.current_role.RoleID,
      "notificationTypeID": this.notificationTypeID,
      "providerServiceMapID": this.dataService.current_service.serviceID
    }).subscribe((response) => {
      console.log(response.data, "notification messages refreshed response");
      this.messages = response.data;
      this.messages = this.messages.filter((item) => item.notificationState != 'future');
      this.notificationIDArray = [];
      this.messages.map((item) => {
        this.notificationIDArray.push(item.userNotificationMapID);
      }, this);
    },
      (error) => {
        console.log(error);
      });
  }

}
