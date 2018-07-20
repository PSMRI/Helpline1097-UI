import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../services/notificationService/notification-service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

@Component({
  selector: 'app-supervisor-location-communication',
  templateUrl: './supervisor-location-communication.component.html',
  styleUrls: ['./supervisor-location-communication.component.css']
})
export class SupervisorLocationCommunicationComponent implements OnInit {

  searchMode: boolean = true;
  editMode: boolean = false;
  createMode: boolean = false;

  serviceProviderID: any;
  providerServiceMapID: any;

  serviceID: any;
  stateID: any;
  createdBy: any;

  minDate: Date = new Date();


  location_communication_typeID: any;

  // arrays
  offices: any = [];
  allOfficeIDs: any = [];
  location_messages: any = [];

  searchStartDate: Date;
  searchEndDate: Date;
  currentDate: Date = new Date();

  @ViewChild('notificationCreationForm') notificationCreationForm: NgForm;


  constructor(public notification_service: NotificationService,
    public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService) { }

  ngOnInit() {
    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this.createdBy = this.commonDataService.Userdata.userName;
    this.getServiceProviderID(this.providerServiceMapID);
    this.getAllNotificationTypes(this.providerServiceMapID);

    this.minDate.setHours(0);
    this.minDate.setMinutes(0);
    this.minDate.setSeconds(0);
    this.minDate.setMilliseconds(0);

    // this.currentDate.setHours(0);
    // this.currentDate.setMinutes(0);
    // this.currentDate.setSeconds(0);
    // this.currentDate.setMilliseconds(0);
  }

  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  sdChange(sd) {
    sd.setHours(0, 0, 0, 0);
  }

  edChange(ed) {
    ed.setHours(23, 59, 59, 0);
  }

  end_date_min_val: Date;
  calculateEndDateMinValue(start_Date) {
    this.end_date_min_val = start_Date;
    this.end_date_min_val.setHours(0);
    this.end_date_min_val.setMinutes(0);
    this.end_date_min_val.setSeconds(0);
    this.end_date_min_val.setMilliseconds(0);
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
    this.getOffices(this.providerServiceMapID);
  }

  handleError(error) {
    this.dialogService.alert("Error encountered", 'error');
  }

  getAllNotificationTypes(providerServiceMapID) {
    this.notification_service.getNotificationTypes(providerServiceMapID)
      .subscribe(response => this.getAllNotificationTypesSuccessHandeler(response),
      err => this.handleError(err));
  }

  getAllNotificationTypesSuccessHandeler(response) {
    console.log("notification types", response);
    if (response.data.length == 0) {
      this.dialogService.alert("No notification types found. contact admin");
    }
    else {
      for (var k = 0; k < response.data.length; k++) {
        if (response.data[k].notificationType.toUpperCase() === "Location Message".toUpperCase()) {
          this.location_communication_typeID = response.data[k].notificationTypeID;
          break;
        }
      }
    }
  }

  getOffices(psmID) {
    this.notification_service.getOffices(psmID).subscribe(response => this.getOfficesSuccessHandeler(response));
  }

  getOfficesSuccessHandeler(response) {
    console.log(response, "offices");
    if (response.length != 0) {
      this.offices = response;
      for (var i = 0; i < this.offices.length; i++) {
        this.allOfficeIDs.push(this.offices[i].pSAddMapID);
      }
    }
    else {
      this.dialogService.alert("No work locations found")
    }
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
      "notificationTypeID": this.location_communication_typeID,
      "workingLocationIDs": this.allOfficeIDs,
      "validStartDate": startDate,
      "validEndDate": endDate
    };

    this.notification_service.getSupervisorNotifications(obj)
      .subscribe((response) => {
        if (response.length != 0) {
          this.location_messages = response.data;
        }
        else {
          this.dialogService.alert("No Location Specific Messages");
        }
      },
      (error) => {
        console.log(error);
        this.dialogService.alert(error, 'error');
      });
  }
  updateTimeOffset(date: any) {
    date = new Date(date.valueOf() - 1 * date.getTimezoneOffset() * 60 * 1000);
    return date;
  }
  createLanguageMessage(form_values) {
    let request_array = [];

    let startDate: Date = new Date(form_values.startDate);
    startDate.setHours(0, 0, 0, 0);
    startDate = this.updateTimeOffset(startDate);
    // startDate.setHours(0);
    // startDate.setMinutes(0);
    // startDate.setSeconds(0);
    // startDate.setMilliseconds(0);

    let endDate: Date = new Date(form_values.endDate);
    endDate.setHours(23, 59, 59, 0);
    endDate = this.updateTimeOffset(endDate);
    // endDate.setHours(23);
    // endDate.setMinutes(59);
    // endDate.setSeconds(59);
    // endDate.setMilliseconds(0);

    let defaultObj = {
      "providerServiceMapID": this.providerServiceMapID,
      "notificationTypeID": this.location_communication_typeID,
      "createdBy": this.createdBy,
      "notification": form_values.subject,
      "notificationDesc": form_values.message,
      "validFrom": startDate,
      "validTill": endDate
    };

    let workingLocationIDs = undefined;
    workingLocationIDs = (form_values.offices == "") ? workingLocationIDs : form_values.offices;

    let roomArray = [];

    if (workingLocationIDs.length > 0) {
      for (var i = 0; i < workingLocationIDs.length; i++) {
        let defaultObj = {
          "providerServiceMapID": this.providerServiceMapID,
          "notificationTypeID": this.location_communication_typeID,
          "createdBy": this.createdBy,
          "notification": form_values.subject,
          "notificationDesc": form_values.message,
          "validFrom": startDate,
          "validTill": endDate,
          "workingLocationID": workingLocationIDs[i]
        };

        roomArray.push(this.providerServiceMapID + "_" + workingLocationIDs[i].toString());

        request_array.push(defaultObj);
      }
    }
    console.log(roomArray);
    this.notification_service.createNotification(request_array)
      .subscribe(response => {
        console.log(response.data, "Location Message created");
        if (response.data.length > 0) {
          this.dialogService.alert("Location message created successfully", 'success');
          this.notificationCreationForm.reset();
          if (startDate.getTime() <= this.currentDate.getTime()) {
            this.notification_service.sendSocketNotification({
              "room": roomArray, type: "Location_Message", "message": form_values.message, "subject": form_values.subject
            })
              .subscribe((response) => {
                console.log(response.data);
              },
              (error) => {
                console.log(error);
              });
          }
        }
      },
      (error) => {
        console.log(error);
        this.dialogService.alert("Location message creation failed. Contact backend team", 'error');
      });
  }

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


  }

  editLocationMessage(form_values) {
    console.log("to be edited values", form_values);

    let startDate: Date = new Date(form_values.startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    let endDate: Date = new Date(form_values.endDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    if (endDate > startDate) {
      let obj = {
        "providerServiceMapID": this.providerServiceMapID,
        "notificationTypeID": this.editRequestObj.notificationTypeID,
        "notificationID": this.editRequestObj.notificationID,
        "notification": form_values.subject,
        "notificationDesc": form_values.message,
        "validFrom": startDate,
        "validTill": endDate,
        "deleted": this.editRequestObj.deleted,
        "modifiedBy": this.createdBy
      }

      this.notification_service.updateNotification(obj).subscribe(response => this.updateSuccess(response), err => this.notificationError(err));
    }
    else {
      this.dialogService.alert("Valid Till should be a future date than Valid From");
      this.edate = undefined;
    }


  }

  updateSuccess(response) {
    console.log(response.data);
    if (response.data) {
      this.showTable();
      this.dialogService.alert(this.editType + " edited successfully", 'success');

      this.refreshExistingTable(this.location_communication_typeID, this.searchStartDate, this.searchEndDate);
    }
  }

  notificationError(error) {
    console.log("error", error);
    this.dialogService.alert("Edit failed. Contact DB team", 'error')
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
      "workingLocationIDs": this.allOfficeIDs,
      "validStartDate": startDate,
      "validEndDate": endDate
    };

    this.notification_service.getSupervisorNotifications(obj)
      .subscribe((response) => {
        if (response.length != 0) {
          this.location_messages = response.data;
        }
        else {
          this.dialogService.alert("No Location Messages");
        }
      },
      (error) => {
        console.log(error);
        this.dialogService.alert(error, 'error');
      });
  }


  showForm() {
    this.searchMode = false;
    this.editMode = false;
    this.createMode = true;
  }

  showTable() {
    this.searchMode = true;
    this.editMode = false;
    this.createMode = false;
  }

}
