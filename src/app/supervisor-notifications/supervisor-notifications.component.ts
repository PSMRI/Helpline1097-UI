import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../services/notificationService/notification-service';
import { dataService } from '../services/dataService/data.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { NotificationsDialogComponent } from '../notifications-dialog/notifications-dialog.component';
import { MdDialog } from '@angular/material';
import { EditNotificationsComponent } from '../edit-notifications/edit-notifications.component';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'
@Component({
  selector: 'app-supervisor-notifications',
  templateUrl: './supervisor-notifications.component.html',
  styleUrls: ['./supervisor-notifications.component.css']
})
export class SupervisorNotificationsComponent implements OnInit {
  providerServiceMapID: any;
  createdBy: any;
  userId: any;
  notificationTypes = [];
  roleObjArray = [];
  notifications = [];
  notificationPostData: any;
  onConfigSubmit: boolean = false;
  p: number = 1;
  minDate: Date;
  roleIDs = [];

  @ViewChild('showNotificationForm') showNotificationForm: NgForm;

  constructor(private notificationService: NotificationService,
    private alertMessage: ConfirmationDialogsService, public commonDataService: dataService, public dialog: MdDialog) { }

  ngOnInit() {
    this.minDate = new Date();
    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this.createdBy = this.commonDataService.uname;
    this.userId = this.commonDataService.uid;
    this.notificationService.getNotificationTypes(this.providerServiceMapID)
      .subscribe((response) => {
        console.log(response);
        this.notificationTypes = response.data;
      },
      (error) => {
        console.log(error);
      });
    this.notificationService.getRoles(this.providerServiceMapID)
      .subscribe((response) => {
        console.log(response);
        this.roleObjArray = response.data;
        for (var i = 0; i < this.roleObjArray.length; i++) {
          this.roleIDs.push(this.roleObjArray[i].RoleID);
        }
      },
      (error) => {
        console.log(error);
      });
  }

  createNotification() {
    let dialog = this.dialog.open(NotificationsDialogComponent, {
      disableClose: true,
      data: {
        notificationTypes: this.notificationTypes,
        roleObjArray: this.roleObjArray
      }
    });
    dialog.afterClosed()
      .subscribe((data) => {
        if (data) {
          this.notificationService.createNotification(data)
            .subscribe((response) => {
              console.log(response);
              if (response.data.length > 0) {
                let dialog = this.dialog.open(MessageDialogComponent, {
                  data: {
                    message: "Succesfully created notification",
                    type: "Message"
                  }
                });
                this.notificationService.getSupervisorNotifications(this.notificationPostData)
                  .subscribe((response) => {
                    this.notifications = response.data;
                    console.log(this.notifications);
                  },
                  (error) => {
                    this.alertMessage.alert(error.status);
                  });
              }
            },
            (error) => {
              console.log(error);
              let dialog = this.dialog.open(MessageDialogComponent, {
                data: {
                  message: "Error in creating notification",
                  type: "Message"
                }
              });
            });
        }
      });
  }
  onSubmitShowForm() {
    console.log(this.showNotificationForm.value);
    console.log(new Date((this.showNotificationForm.value.startDate) - 1 * (this.showNotificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z");
    this.onConfigSubmit = true;
    this.notificationPostData = {
      "providerServiceMapID": this.providerServiceMapID,
      "notificationTypeID": this.showNotificationForm.value.notificationType,
      "roleIDs": (this.showNotificationForm.value.roles == "") ? this.roleIDs : this.showNotificationForm.value.roles,
      "validStartDate": new Date((this.showNotificationForm.value.startDate) - 1 * (this.showNotificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z",
      "validEndDate": new Date((this.showNotificationForm.value.endDate) - 1 * (this.showNotificationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z"
    };
    console.log(JSON.stringify(this.notificationPostData));
    this.notificationService.getSupervisorNotifications(this.notificationPostData)
      .subscribe((response) => {
        this.notifications = response.data;
        console.log(this.notifications);
      },
      (error) => {
        console.log(error);
      });
  }

  onEditClick(row, event) {
    event.preventDefault();
    let dialog = this.dialog.open(EditNotificationsComponent, {
      data: row,
      disableClose: true
    });
    dialog.afterClosed()
      .subscribe((data) => {
        if (data) {
          this.notificationService.updateNotification(data)
            .subscribe((response) => {
              console.log(response);
              if (response.data != {}) {
                let dialog = this.dialog.open(MessageDialogComponent, {
                  data: {
                    message: "Succesfully edited notification",
                    type: "Message"
                  }
                });
                this.notificationService.getSupervisorNotifications(this.notificationPostData)
                  .subscribe((response) => {
                    this.notifications = response.data;
                  },
                  (error) => {
                    this.alertMessage.alert(error.status);
                  });
              }
            },
            (error) => {
              console.log(error);
              let dialog = this.dialog.open(MessageDialogComponent, {
                data: {
                  message: "Error in editing notification",
                  type: "Message"
                }
              });
            })
        }
      })
  }

}
