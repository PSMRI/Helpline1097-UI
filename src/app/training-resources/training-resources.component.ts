import { Component, OnInit } from '@angular/core';
import { DashboardHttpServices } from '../http-service/http-service.service';
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MdDialog } from '@angular/material';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'

@Component({
    selector: 'app-training-resources',
    templateUrl: './training-resources.component.html',
    styleUrls: ['./training-resources.component.css']
})
export class TrainingResourcesComponent implements OnInit {

    role: any;
    service: any;
    profile: any;
    kmConfig: any;
    kmfiles: any;
    kmPostData: any;
    constructor(private dashboardHttpServices: DashboardHttpServices, public alertService: ConfirmationDialogsService, private dataService: dataService, private notificationService: NotificationService, public dialog: MdDialog) { }


    ngOnInit() {
        this.role = this.dataService.current_role;
        this.service = this.dataService.current_service;
        console.log("providerServiceMapID" + this.service.serviceID);
        this.notificationService.getNotificationTypes(this.service.serviceID)
            .subscribe((response) => {
                console.log(response, "RELATED TO KM");
                // let currentDate = this.getOffsetTime();
                let currentDate = new Date();
                this.kmConfig = response.data.filter((notification) => {
                    return notification.notificationType == "KM";
                });
                if (this.kmConfig.length > 0) {
                    // if(this.role.RoleName!="Supervisor"){
                    //     this.kmPostData = {
                    //         "providerServiceMapID": this.service.serviceID,
                    //         "notificationTypeID": this.kmConfig[0].notificationTypeID,
                    //         "roleIDs": [this.role.RoleID],
                    //         "validFrom": new Date().toISOString().slice(0,10) + "T00:00:00.000Z",
                    //         //currently alerts and notifications from current date to one week(7*24*60*60*1000)
                    //         "validTill": new Date(Date.now()+7*24*60*60*1000).toISOString().slice(0,10) + "T23:59:59.999Z"
                    //     };
                    // }
                    // else {
                    this.kmPostData = {
                        "providerServiceMapID": this.service.serviceID,
                        "notificationTypeID": this.kmConfig[0].notificationTypeID,
                        "roleIDs": [this.role.RoleID],
                        // "validFrom": new Date().toISOString().slice(0, 10) + "T00:00:00.000Z",
                        "validFrom": currentDate,
                        //currently alerts and notifications from current date to one week(7*24*60*60*1000)
                        // "validTill": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + "T23:59:59.999Z"
                        "validTill": currentDate
                    };
                    // }
                }
                this.getKmFiles();
            },
            (err) => {
                this.alertService.alert(err.errorMessage, 'error');

                console.log(err);
            });


    }

    getKmFiles() {
        // console.log(this.alertPostData);
        // console.log(this.notificationPostData);
        if (this.kmPostData) {
            console.log(this.kmPostData);
            // if (this.role.RoleName != "Supervisor") {
            this.notificationService.getKMs(this.kmPostData)
                .subscribe((response) => {
                    console.log(response, "KM files response");

                    this.kmfiles = response.data;
                },
                (err) => {
                    this.alertService.alert(err.errorMessage, 'error');

                    console.log(err);
                });
            // }
            // else {
            //     this.notificationService.getSupervisorNotifications(this.kmPostData)
            //         .subscribe((response) => {
            //             console.log(response);
            //             this.kmfiles = response.data;
            //         },
            //         (err) => {
            //             console.log(err);
            //         });
            // }
        }
    }

    kmClicked(km, event) {
        event.preventDefault();
        let dialog = this.dialog.open(MessageDialogComponent, {
            width: 0.8 * window.innerWidth + "px",
            panelClass: 'dialog-width',
            disableClose: true,
            data: {
                message: km.notificationDesc,
                type: "KM",
                kmFilePath: km.kmFilePath
            }
        });
    }

    // getOffsetTime() {
    //     let date = new Date();
    //     return new Date((date.getTime() - 1 * (date.getTimezoneOffset() * 60 * 1000)));
    // }
}
