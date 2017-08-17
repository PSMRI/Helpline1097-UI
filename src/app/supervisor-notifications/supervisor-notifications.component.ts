import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../services/notificationService/notification-service';
import { dataService } from '../services/dataService/data.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { NotificationsDialogComponent } from '../notifications-dialog/notifications-dialog.component';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'app-supervisor-notifications',
  templateUrl: './supervisor-notifications.component.html',
  styleUrls: ['./supervisor-notifications.component.css']
})
export class SupervisorNotificationsComponent implements OnInit {
  providerServiceMapID: any;
  createdBy: any;
  userId : any;
  notificationTypes = [];
  roleObjArray = [];
  notifications = [];
  notificationPostData : any;
  onConfigSubmit : boolean = false;
  p: number = 1;

  @ViewChild('showNotificationForm') showNotificationForm: NgForm;
  
  constructor(private notificationService: NotificationService,public commonDataService: dataService, public dialog : MdDialog) { }

  ngOnInit() {
    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this.createdBy = this.commonDataService.uname;
    this.userId = this.commonDataService.uid;
    this.notificationService.getNotificationTypes(this.providerServiceMapID)
    .subscribe((response)=>{
      console.log(response);
      this.notificationTypes = response.data;
    },
    (error)=>{
      console.log(error);
    });
    this.notificationService.getRoles(this.providerServiceMapID)
    .subscribe((response)=>{
      console.log(response);
      this.roleObjArray = response.data;
    },
    (error)=>{
      console.log(error);
    });
  }

  createNotification(){
    let dialog = this.dialog.open(NotificationsDialogComponent, {
      disableClose : true,
      data : {
        notificationTypes : this.notificationTypes,
        roleObjArray : this.roleObjArray
      }
    });
    dialog.afterClosed()
    .subscribe((data)=>{
      if(data){
        this.notificationService.createNotification(data)
        .subscribe((response)=>{
          console.log(response);
          if(response.data.length > 0){
            let dialog = this.dialog.open(MessageDialogComponent, {
              data: {
                  message: "Succesfully created notification",
                  type: "Message"
              }
            });
          this.notificationService.getNotifications(this.notificationPostData)
            .subscribe((response)=>{
              this.notifications = response.data;
              console.log(this.notifications);
            },
            (error)=>{
              console.log(error);
            });   
          }
        },
        (error)=> {
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
  onSubmitShowForm(){
    console.log(this.showNotificationForm.value);
    this.onConfigSubmit = true;
    this.notificationPostData = {
                "providerServiceMapID": this.providerServiceMapID,
                "notificationTypeID": this.showNotificationForm.value.notificationType,
                "roleIDs": this.showNotificationForm.value.roles,
                "validFrom": new Date((this.showNotificationForm.value.startDate) - 1 * (this.showNotificationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON(),
                "validTill": new Date((this.showNotificationForm.value.endDate) - 1 * (this.showNotificationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON()
            };
    console.log(JSON.stringify(this.notificationPostData));
    this.notificationService.getNotifications(this.notificationPostData)
    .subscribe((response)=>{
      this.notifications = response.data;
      console.log(this.notifications);
    },
    (error)=>{
      console.log(error);
    });        
  }

}
