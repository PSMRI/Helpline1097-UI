import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../services/notificationService/notification-service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-supervisor-alerts-notifications',
  templateUrl: './supervisor-alerts-notifications.component.html',
  styleUrls: ['./supervisor-alerts-notifications.component.css']
})
export class SupervisorAlertsNotificationsComponent implements OnInit {

  serviceProviderID: any;
  providerServiceMapID: any;

  serviceID: any;
  stateID: any;

  createdBy: any;

  types: any = []; // array of all notification types(but here filtered with only Alert & Notification)
  roles: any = []; //array of all roles(but here filtered except Provider Admin)
  offices: any = [];

  allRoleIDs: any = [];// array of all role IDs

  minDate: Date = new Date();

  alerts_notifications: any = [];  //table array

  // flags
  searchMode: boolean = true;
  editMode: boolean = false;
  createMode: boolean = false;

  // search time ngModels
  searchNotificationType: any;
  searchStartDate: Date;
  searchEndDate: Date;
  currentDate: Date = new Date();

  startTime;
  endTime;

  @ViewChild('notificationCreationForm') notificationCreationForm: NgForm;
  @ViewChild('notificationEditingForm') notificationEditingForm: NgForm;
  currentLanguageSet: any;

  constructor(public notification_service: NotificationService,
    public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService,
    public httpServices:HttpServices) {

    // this.alerts_notifications = [
    //   {
    //     "type": "Alert",
    //     "subject": "Meeting Alert",
    //     "description": "Kindly come early for meeting. Timings: 10:00-12:00",
    //     "validFrom": "24/12/2017",
    //     "validTill": "24/12/2017"
    //   },
    //   {
    //     "type": "Alert",
    //     "subject": "Meeting Alert",
    //     "description": "Kindly come early for meeting. Timings: 10:00-12:00",
    //     "validFrom": "24/12/2017",
    //     "validTill": "24/12/2017"
    //   },
    //   {
    //     "type": "Notification",
    //     "subject": "New Member in Team",
    //     "description": "New member named Ashish will be joing the team shortly. Kindly make arrangements",
    //     "validFrom": "24/12/2017",
    //     "validTill": "24/12/2017"
    //   }]
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this.createdBy = this.commonDataService.Userdata.userName;
    this.getServiceProviderID(this.providerServiceMapID);
    this.getAllNotificationTypes(this.providerServiceMapID);
    this.getAllRoles(this.providerServiceMapID);

    this.minDate.setHours(0);
    this.minDate.setMinutes(0);
    this.minDate.setSeconds(0);
    this.minDate.setMilliseconds(0);

    this.currentDate.setHours(0);
    this.currentDate.setMinutes(0);
    this.currentDate.setSeconds(0);
    this.currentDate.setMilliseconds(0);
  }

  ngDoCheck() {
		this.assignSelectedLanguage();
	  }

	assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }

  sdChange(sd) {
    sd.setHours(0, 0, 0, 0);
  }

  edChange(ed) {
    ed.setHours(23, 59, 59, 0);
  }

  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  getServiceProviderID(providerServiceMapID) {
    this.notification_service.getServiceProviderID(providerServiceMapID)
      .subscribe(response => this.getServiceProviserIDSuccessHandeler(response),
      err => this.handleError(err));
  }

  getServiceProviserIDSuccessHandeler(response) {
    this.serviceProviderID = response.serviceProviderID;
    this.serviceID = response.serviceID;
    this.stateID = response.stateID;
  }

  handleError(error) {
    this.dialogService.alert(this.currentLanguageSet.errorEncountered, 'error');
  }

  getAllNotificationTypes(providerServiceMapID) {
    this.notification_service.getNotificationTypes(providerServiceMapID)
      .subscribe(response => this.getAllNotificationTypesSuccessHandeler(response),
      err => this.handleError(err));
  }

  getAllNotificationTypesSuccessHandeler(response) {
    console.log('notification types', response);
    if (response.data.length === 0) {
      this.dialogService.alert(this.currentLanguageSet.noNotificationTypesFoundContactAdmin)
    }
    else {
      this.types = response.data.filter(item => {
        return (item.notificationType.toUpperCase() === "Alert".toUpperCase()) ||
          (item.notificationType.toUpperCase() === "Notification".toUpperCase());
      });
    }
  }

  getAllRoles(providerServiceMapID) {
    this.notification_service.getRoles(this.providerServiceMapID)
      .subscribe((response) => {
        if (response.data.length != 0) {
          this.roles = response.data.filter(item => {
            return item.featureName.length != 0;
          });
          for (var i = 0; i < this.roles.length; i++) {
            this.allRoleIDs.push(this.roles[i].roleID);
          }
        }
        else {
          this.dialogService.alert(this.currentLanguageSet.noRolesFound)
        }

      },
      (error) => {
        console.log(error);
      });
  }

  getOffices(roleID) {
    if (roleID == 'All') {
      roleID = undefined;
      this.notificationCreationForm.form.patchValue({ 'offices': undefined });
    }
    this.notification_service.getOfficeByRole(this.providerServiceMapID, roleID)
      .subscribe(response => this.getOfficeSuccessHandeler(response),
      err => this.getOfficeErrorHandeler(err));
  }

  getOfficeSuccessHandeler(response) {
    console.log(response, "Offices based on role");
    this.notificationCreationForm.form.patchValue({ 'offices': undefined });
    if (response.length == 0) {
      this.dialogService.alert(this.currentLanguageSet.noOfficeFoundWithTheSelectedRoleFunctionalInThem)
    }
    else {
      this.offices = response;
    }
  }

  getOfficeErrorHandeler(error) {
    this.dialogService.alert(error, 'error');

  }

  getNotifications(form_values) {
    let startDate: Date = new Date(form_values.startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0)

    let endDate: Date = new Date(form_values.endDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    let obj = {
      "providerServiceMapID": this.providerServiceMapID,
      "notificationTypeID": form_values.notificationType,
      "roleIDs": this.allRoleIDs,
      "validStartDate": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
      "validEndDate": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000)
    };

    this.notification_service.getSupervisorNotifications(obj)
      .subscribe((response) => {
        if (response.length != 0) {
          this.alerts_notifications = response.data;
        }
        else {
          this.dialogService.alert(this.currentLanguageSet.noAlertsOrNotifications);
        }
      },
      (error) => {
        console.log(error);
        this.dialogService.alert(error, 'error');
      });
  }

  createAlertNotification(form_values) {
    let startDate: Date = new Date(form_values.startDate);
    let endDate: Date = new Date(form_values.endDate);

    if (form_values.startTime) {
      startDate.setHours(form_values.startTime.split(":")[0]);
      startDate.setMinutes(form_values.startTime.split(":")[1]);
    } else {
      startDate.setHours(0);
      startDate.setMinutes(0);
    }
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    if (form_values.endTime) {
      endDate.setHours(form_values.endTime.split(":")[0]);
      endDate.setMinutes(form_values.endTime.split(":")[1]);
      endDate.setSeconds(0);
    } else {
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);
    }
    endDate.setMilliseconds(0);

    let defaultObj = {
      "providerServiceMapID": this.providerServiceMapID,
      "notificationTypeID": form_values.notificationType,
      "createdBy": this.createdBy,
      "notification": form_values.subject,
      "notificationDesc": form_values.message,
      "validFrom": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
      "validTill": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000)
    };

    let roleID = (form_values.role == undefined || form_values.role == null || form_values.role == "" || form_values.role == "All") ? undefined : form_values.role;
    defaultObj['roleID'] = roleID;

    let allOfficeIDs = (form_values.offices == undefined || form_values.offices == null || form_values.offices == "") ? undefined : form_values.offices;

    let requestArray = [];  //resetting of request array

    // checking if locations are selected or not; if yes=> loop through them and create multiple objects and push in request array ; else=> push the single request object
    if (allOfficeIDs != undefined && allOfficeIDs.length > 0) {
      for (let x = 0; x < allOfficeIDs.length; x++) {
        defaultObj['workingLocationID'] = allOfficeIDs[x];
        requestArray.push(defaultObj);
      }
    }
    else {
      requestArray.push(defaultObj);
    }

    let roomArray = [];
    if (roleID == undefined && allOfficeIDs == undefined) {
      for (var i = 0; i < this.roles.length; i++) {
        roomArray.push(this.providerServiceMapID + "_" + this.roles[i].roleName.toLowerCase());
      }
    }
    else if (roleID != undefined && allOfficeIDs == undefined) {
      let selectedRole = this.roles.filter((item) => {
        return item.roleID == roleID;
      })
      roomArray.push(this.providerServiceMapID + "_" + selectedRole[0].roleName.toLowerCase());
    }
    else {
      let selectedRole = this.roles.filter((item) => {
        return item.roleID == roleID;
      })
      for (var i = 0; i < allOfficeIDs.length; i++) {
        roomArray.push(this.providerServiceMapID + "_" + selectedRole[0].roleName.toLowerCase() + "_" + allOfficeIDs[i]);
      }
    }

    console.log(roomArray, "RoomArray");

    this.notification_service.createNotification(requestArray)
      .subscribe(response => {
        console.log(response, "NOTIFICATION/ALERT CREATED");
        let currentDate = new Date();

        if (response.data != undefined && response.data.length > 0) {
          if (response.data[0].notificationTypeID == 18) {
            this.dialogService.alert(this.currentLanguageSet.alertCreatedSuccessfully, 'success');
            this.notificationCreationForm.reset();
            if (startDate.getTime() <= currentDate.getTime()) {
              this.notification_service.sendSocketNotification({
                "room": roomArray, type: "Alert", "message": form_values.message, "subject": form_values.subject
              })
                .subscribe((res) => {
                  console.log(res.data);
                },
                (error) => {
                  console.log(error);
                });
            }
          }
          if (response.data[0].notificationTypeID == 19) {
            this.dialogService.alert(this.currentLanguageSet.notificationCreatedSuccessfully, 'success');
            this.notificationCreationForm.reset();
            if (startDate.getTime() <= currentDate.getTime()) {
              this.notification_service.sendSocketNotification({
                "room": roomArray, type: "Notification", "message": form_values.message, "subject": form_values.subject
              })
                .subscribe((res) => {
                  console.log(res.data);
                },
                (error) => {
                  console.log(error);
                });
            }
          }
        }
        if (response.statusCode === 5000) {
          this.dialogService.alert(response.status, 'error');

        }
      },
      (error) => {
        console.log(error);
        this.dialogService.alert(this.currentLanguageSet.notificationAlertCreationFailedContactBackendTeam, 'error');
      });
  }

  invalidTimeFlag = false;
  validateTime(start_date, end_date, start_time, end_time) {
    if (start_time === undefined && end_time === undefined) {

    }
    if (start_time != undefined && end_time != undefined &&
      start_date.getDate() != undefined && end_date.getDate() != undefined) {
      if ((start_date.getDate() === end_date.getDate()) && (start_time > end_time)) {
        this.invalidTimeFlag = true;
      }
      if ((start_date.getDate() === end_date.getDate()) && (start_time < end_time)) {
        this.invalidTimeFlag = false;
      }
      if ((start_date.getDate() === end_date.getDate()) && (start_time === end_time)) {
        this.invalidTimeFlag = true;
      }
      if (start_date.getDate() != end_date.getDate()) {
        this.invalidTimeFlag = false;
      }
    }
  }

  /*-----content for editing---------  */
  editType: any;
  notification_subject: any;
  description: any;
  sdate: Date;
  edate: Date;

  editRequestObj: any;

  edit(toBeEditedOBJ) {
    this.editRequestObj = toBeEditedOBJ;
    console.log("TO BE EDITED OBJ", toBeEditedOBJ);
    this.searchMode = false;
    this.createMode = false;
    this.editMode = true;

    this.editType = toBeEditedOBJ.notificationType.notificationType;

    this.notification_subject = toBeEditedOBJ.notification;
    this.description = toBeEditedOBJ.notificationDesc;
    this.sdate = new Date(toBeEditedOBJ.validFrom);
    this.edate = new Date(toBeEditedOBJ.validTill);
    this.startTime = toBeEditedOBJ.validFrom.split('T')[1].split(':')[0] + ':' + toBeEditedOBJ.validFrom.split('T')[1].split(':')[1];
    this.endTime = toBeEditedOBJ.validTill.split('T')[1].split(':')[0] + ':' + toBeEditedOBJ.validTill.split('T')[1].split(':')[1];

  }

  editAlertNotification(form_values) {
    console.log("to be edited values", form_values);
    let startDate: Date = new Date(form_values.startDate);
    let endDate: Date = new Date(form_values.endDate);

    if (form_values.startTime) {
      startDate.setHours(form_values.startTime.split(":")[0]);
      startDate.setMinutes(form_values.startTime.split(":")[1]);
    } else {
      startDate.setHours(0);
      startDate.setMinutes(0);
    }
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    if (form_values.endTime) {
      endDate.setHours(form_values.endTime.split(":")[0]);
      endDate.setMinutes(form_values.endTime.split(":")[1]);
      endDate.setSeconds(0);
    } else {
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);
    }
    endDate.setMilliseconds(0);

    if (endDate > startDate) {
      let obj = {
        "providerServiceMapID": this.providerServiceMapID,
        "notificationTypeID": this.editRequestObj.notificationTypeID,
        "notificationID": this.editRequestObj.notificationID,
        "roleID": this.editRequestObj.roleID,
        "notification": form_values.subject,
        "notificationDesc": form_values.message,
        "validFrom": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
        "validTill": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000),
        "deleted": this.editRequestObj.deleted,
        "modifiedBy": this.createdBy
      }

      this.notification_service.updateNotification(obj).subscribe(response => this.updateSuccess(response), err => this.notificationError(err));
    }
    else {
      this.dialogService.alert(this.currentLanguageSet.validTillShouldBeAFutureDateThanValidFrom);
      this.edate = undefined;
    }


  }

  updateSuccess(response) {
    console.log(response.data);
    if (response.data) {
      this.showTable();
      this.dialogService.alert(this.editType +' '+ this.currentLanguageSet.editedSuccessfully, 'success');

      this.refreshExistingTable(this.searchNotificationType, this.searchStartDate, this.searchEndDate);
    }
  }

  notificationError(error) {
    console.log("error", error);
    this.dialogService.alert(this.currentLanguageSet.editFailedContactDbTeam, 'error')
  }

  /* ------------- */

  showForm() {
    this.searchMode = false;
    this.editMode = false;
    this.createMode = true;
  }

  showTable() {
    if(this.createMode === true)
    {
      this.invalidTimeFlag = false;
      this.notificationCreationForm.reset();
    }
    if(this.editMode === true)
    {
      this.notificationEditingForm.reset();
    }
    this.searchMode = true;
    this.editMode = false;
    this.createMode = false;
  }

  refreshExistingTable(type, startdate, enddate) {
    let startDate: Date = new Date(startdate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0)

    let endDate: Date = new Date(enddate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    let obj = {
      "providerServiceMapID": this.providerServiceMapID,
      "notificationTypeID": type,
      "roleIDs": this.allRoleIDs,
      "validStartDate": startDate,
      "validEndDate": endDate
    };

    this.notification_service.getSupervisorNotifications(obj)
      .subscribe((response) => {
        if (response.length != 0) {
          this.alerts_notifications = response.data;
        }
        else {
          this.dialogService.alert(this.currentLanguageSet.noAlertsOrNotifications);
        }
      },
      (error) => {
        console.log(error);
        this.dialogService.alert(error, 'error');
      });
  }

  resetEndDate() {
    this.edate = undefined;
  }
  min_time: any;
  checkValidationForEndTime(start_date, start_time, end_date, end_time) {
    if (start_date == end_date) {
      if (start_time != undefined && end_time != undefined) {
        if (start_time > end_time) {
          this.dialogService.alert(this.currentLanguageSet.endTimeCantBeLessThanStartTime, 'info');
          this.endTime = undefined;
        }
      }
    }
  }


}
