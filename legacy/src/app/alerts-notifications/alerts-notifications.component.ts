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


import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Inject,
  Input,
} from "@angular/core";
import { DashboardHttpServices } from "../http-service/http-service.service";
import { dataService } from "../services/dataService/data.service";
import { NotificationService } from "../services/notificationService/notification-service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { MessageDialogComponent } from "../message-dialog/message-dialog.component";
import { MdDialog, MdDialogRef } from "@angular/material";
import { MD_DIALOG_DATA } from "@angular/material";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
import { DoCheck } from "@angular/core";

@Component({
  selector: "alerts-notifications",
  templateUrl: "./alerts-notifications.component.html",
  styleUrls: ["./alerts-notifications.component.css"],
})
export class AlertsNotificationComponent implements OnInit, DoCheck {
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
  assignSelectedLanguageValue: any;

  constructor(
    private dashboardHttpServices: DashboardHttpServices,
    private dataService: dataService,
    private notificationService: NotificationService,
    public dialog: MdDialog,
    private alertService: ConfirmationDialogsService,
    private httpServices: HttpServices
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    this.userId = this.dataService.uid;
    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.roleId = this.dataService.current_role.RoleID;
    this.workingLocationID = this.dataService.current_workingLocationID;
    this.getCount();

    this.notificationService
      .getNotificationTypes(this.providerServiceMapID)
      .subscribe(
        (response) => {
          console.log(
            response,
            "notification Types in dashboard Alert component"
          );
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
        }
      );
  }

  getCount() {
    this.notificationService
      .getCount({
        userID: this.userId,
        roleID: this.roleId,
        providerServiceMapID: this.providerServiceMapID,
      })
      .subscribe(
        (response) => {
          console.log("count api response", response.data);
          if (response.data.userNotificationTypeList.length > 0) {
            let alertObj = response.data.userNotificationTypeList.filter(
              (item) => {
                return item.notificationType == "Alert";
              }
            );
            let othersObj = response.data.userNotificationTypeList.filter(
              (item) => {
                return item.notificationType == "Location Message";
              }
            );
            let notificationObj = response.data.userNotificationTypeList.filter(
              (item) => {
                return item.notificationType == "Notification";
              }
            );
            if (alertObj.length > 0) {
              this.alertCount = alertObj[0].notificationTypeUnreadCount;
            } else {
              this.alertCount = 0;
            }
            if (othersObj.length > 0) {
              this.othersCount = othersObj[0].notificationTypeUnreadCount;
            } else {
              this.othersCount = 0;
            }
            if (notificationObj.length > 0) {
              this.notificationCount =
                notificationObj[0].notificationTypeUnreadCount;
            } else {
              this.notificationCount = 0;
            }
            console.log(
              "alertCount:",
              this.alertCount,
              "othersCount:",
              this.othersCount,
              "notificationCount:",
              this.notificationCount
            );
          } else {
            this.alertCount = 0;
            this.notificationCount = 0;
            this.othersCount = 0;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ngOnChanges() {
    if (this.alertRefresh > 1) {
      this.getCount();
    }
  }

  openNotificationsDialog(messages_type) {
    let notificationTypeId;

    if (messages_type == "Alert") {
      notificationTypeId = this.alertConfig[0].notificationTypeID;
    } else if (messages_type == "Notification") {
      notificationTypeId = this.notificationConfig[0].notificationTypeID;
    } else {
      notificationTypeId = this.othersConfig[0].notificationTypeID;
    }

    let messages = [];

    this.notificationService
      .getNotificationDetails({
        userID: this.userId,
        roleID: this.roleId,
        notificationTypeID: notificationTypeId,
        providerServiceMapID: this.providerServiceMapID,
      })
      .subscribe(
        (response) => {
          console.log(response.data, "notification details api response");
          messages = response.data;
          messages = messages.filter(
            (item) => item.notificationState != "future"
          );
          if (messages.length > 0) {
            let dialogRef = this.dialog.open(
              AlertsNotificationsDialogComponent,
              {
                width: "600px",
                // height: '500px',
                disableClose: false,
                data: {
                  msg_type: messages_type,
                  messages: messages,
                  notificationTypeID: notificationTypeId,
                },
              }
            );

            dialogRef.afterClosed().subscribe(
              (response) => {
                this.getCount();
              },
              (error) => {
                console.log(error);
              }
            );
          } else {
            this.alertService.alert(
              this.assignSelectedLanguageValue.no + " " + messages_type.toLowerCase() + " " + this.assignSelectedLanguageValue.messagesFound
            );
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  /*
   * JA354063 - Created on 29-07-2021
   */
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
}

@Component({
  selector: "app-alerts-notifications-dialog",
  templateUrl: "./alerts-notifications-dialog.html",
  styleUrls: ["./alerts-notifications.component.css"],
})
export class AlertsNotificationsDialogComponent {
  messages: any = [];
  heading: any;
  notificationTypeID: any;
  notificationIDArray: any = [];
  assignSelectedLanguageValue: any;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<AlertsNotificationsDialogComponent>,
    private notificationService: NotificationService,
    private dataService: dataService,
    private alertService: ConfirmationDialogsService,
    private httpServices: HttpServices
  ) {
    this.initialize(this.data);
  }

  initialize(data) {
    this.messages = data.messages;
    this.heading = data.msg_type.toLowerCase();
    this.notificationTypeID = data.notificationTypeID;
    this.messages.map((item) => {
      this.notificationIDArray.push(item.userNotificationMapID);
    }, this);
  }

  unreadAll() {
    console.log("call api and on success re initialize messages");
    this.notificationService
      .changeNotificationStatus({
        notficationStatus: "unread",
        userNotificationMapIDList: this.notificationIDArray,
      })
      .subscribe(
        (response) => {
          console.log(response.data, "unread all api response");
          if (response.data.status == "success") this.reInitialize();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  readAll() {
    console.log("call api and on success re initialize messages");
    this.notificationService
      .changeNotificationStatus({
        notficationStatus: "read",
        userNotificationMapIDList: this.notificationIDArray,
      })
      .subscribe(
        (response) => {
          console.log(response.data, "read all api response");
          if (response.data.status == "success") this.reInitialize();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  unreadSingle(id) {
    let notificationIDArray = [id];
    this.notificationService
      .changeNotificationStatus({
        notficationStatus: "unread",
        userNotificationMapIDList: notificationIDArray,
      })
      .subscribe(
        (response) => {
          if (response.data.status == "success") this.reInitialize();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  readSingle(id) {
    let notificationIDArray = [id];
    this.notificationService
      .changeNotificationStatus({
        notficationStatus: "read",
        userNotificationMapIDList: notificationIDArray,
      })
      .subscribe(
        (response) => {
          if (response.data.status == "success") this.reInitialize();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  deleteNotification(id) {
    console.log(id, "use id and call api, on success re initialize messages");
    this.alertService
      .confirm("", this.assignSelectedLanguageValue.areYouSureYouWantToDelete)
      .subscribe((res) => {
        if (res) {
          this.notificationService
            .deleteNotification({
              isDeleted: true,
              userNotificationMapIDList: [id],
            })
            .subscribe(
              (response) => {
                console.log(response.data, "delete notification api response");
                if (response.data.status == "success") this.reInitialize();
              },
              (error) => {
                console.log(error);
              }
            );
        }
      });
  }

  reInitialize() {
    this.notificationService
      .getNotificationDetails({
        userID: this.dataService.uid,
        roleID: this.dataService.current_role.RoleID,
        notificationTypeID: this.notificationTypeID,
        providerServiceMapID: this.dataService.current_service.serviceID,
      })
      .subscribe(
        (response) => {
          console.log(
            response.data,
            "notification messages refreshed response"
          );
          this.messages = response.data;
          this.messages = this.messages.filter(
            (item) => item.notificationState != "future"
          );
          this.notificationIDArray = [];
          this.messages.map((item) => {
            this.notificationIDArray.push(item.userNotificationMapID);
          }, this);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  /*
   * JA354063 - Created on 29-07-2021
   */
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
}
