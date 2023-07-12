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


import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../services/notificationService/notification-service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';
import { LoaderService } from '../services/common/loader.service';

@Component({
  selector: 'app-supervisor-emergency-contacts',
  templateUrl: './supervisor-emergency-contacts.component.html',
  styleUrls: ['./supervisor-emergency-contacts.component.css']
})
export class SupervisorEmergencyContactsComponent implements OnInit {

  // ngModels
  name: any;
  designation: any;
  location: any;
  contactNumber: any;

  // arrays
  emergencyList: any = [];
  designations: any = [];
  roles: any = [];

  // flags
  showTable = true;
  showForm = false;
  showEditForm = false;

  // variables
  providerServiceMapID: any;
  notificationTypeID: any;
  emergency_contact_related_data: any = [];
  bufferArray: any = [];
  createdBy: any;

  editData: any;
  currentDate: Date = new Date();

  @ViewChild('emergencyContact') emergencyContactForm: NgForm;

  @ViewChild('editEmergencyContact') editEmergencyContactForm: NgForm;
  currentLanguageSet: any;



  constructor(public notification_service: NotificationService,
    public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService,
    public httpServices:HttpServices,
    private loaderService: LoaderService) { }

    numberRegex: any;
  filteredsearchResult: any;
  showProgressBar: Boolean = false;
  ngOnInit() {
    this.assignSelectedLanguage();
    this.numberRegex = "^[1-9][0-9]*$";
    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this.createdBy = this.commonDataService.Userdata.userName;
    this.getNotificationTypeID();
    this.getAllDesignations();
    this.getAllRoles(this.providerServiceMapID);

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

  getAllRoles(providerServiceMapID) {
    this.notification_service.getRoles(this.providerServiceMapID)
      .subscribe((response) => {
        if (response.data.length != 0) {
          this.roles = response.data.filter(item => {
            return item.featureName.length!=0;
          });
        }
      },
      (error) => {
        console.log(error);
      });
  }

  getAllDesignations() {
    this.notification_service.getAllDesignations()
      .subscribe(response => {
        if (response.length > 0) {
          console.log(response, 'designations');
          this.designations = response;
        }
      }, err => {
        console.log(err, 'error in getting designations');
      })
  }

  getNotificationTypeID() {
    this.notification_service.getNotificationTypes(this.providerServiceMapID)
      .subscribe((response) => { this.notificationTypeSuccess(response) },
      (error) => {
        console.log(error);
      });
  }

  notificationTypeSuccess(res) {
   
      this.emergency_contact_related_data = res.data.filter((notification) => {
        return notification.notificationType == "Emergency Contact";
      });
   
    console.log(this.emergency_contact_related_data, 'notificationTypeID');
    this.notificationTypeID = this.emergency_contact_related_data[0].notificationTypeID;

    // get emergency contacts history

    this.getEmergencyList(this.providerServiceMapID, this.emergency_contact_related_data[0].notificationTypeID);

  }

  getEmergencyList(providerServiceMapID, notificationTypeID) {
    const obj = {
      'providerServiceMapID': providerServiceMapID,
      'notificationTypeID': notificationTypeID
    }
    this.notification_service.getSupervisorEmergencyContacts(obj)
      .subscribe(response => {
        if (response.data) {
          console.log('Supervisor Emergency Contacts success callback', response.data);
          this.emergencyList = response.data;
          this.filteredsearchResult = response.data;
        }
      }, err => {
        console.log('error', err);
      })
  }

  push2buffer(object) {
    const obj = {
      'providerServiceMapID': this.providerServiceMapID,
      'notificationTypeID': this.notificationTypeID,
      'createdBy': this.createdBy,
      'designationID': object.designation.designationID,
      'emergContactName': (object !=undefined && object !=null && object.name !=undefined && object.name !=null) ? object.name.trim() :null,
      'location': (object !=undefined && object !=null && object.location !=undefined && object.location !=null) ? object.location.trim() :null,
      'emergContactNo': object.contactNumber,
      'designationName': object.designation.designationName
    }
    if (this.bufferArray.length === 0) {
      let flag2 = false;
      for (let j = 0; j < this.emergencyList.length; j++) {
        if (this.emergencyList[j].emergContactNo === object.contactNumber) {
          flag2 = true;
          break;
        }
      }
      if (!flag2) {
        this.bufferArray.push(obj);
        this.emergencyContactForm.reset();

      }
      else {
        console.log('Duplicate exists');
        this.dialogService.alert(this.currentLanguageSet.duplicateMobileNumber, 'info');
        this.emergencyContactForm.reset();
      }
    }
    else if (this.bufferArray.length > 0) {
      let flag1 = false;
      let flag2 = false;
      for (let i = 0; i < this.bufferArray.length; i++) {
        if (this.bufferArray[i].emergContactNo === object.contactNumber) {
          flag1 = true;
          break;
        }
      }

      for (let j = 0; j < this.emergencyList.length; j++) {
        if (this.emergencyList[j].emergContactNo === object.contactNumber) {
          flag2 = true;
          break;
        }
      }

      if (flag1 === false && flag2 === false) {
        this.bufferArray.push(obj);
        this.emergencyContactForm.reset();

      }
      else {
        console.log('Duplicate exists');
        this.dialogService.alert(this.currentLanguageSet.duplicateMobileNumber, 'info');
        this.emergencyContactForm.reset();
      }
    }
  }

  remove(index) {
    this.bufferArray.splice(index, 1);
  }

  createEmergencyContact(array) {
    if (array.length !== 0) {
      this.notification_service.createEmergencyContacts(array)
        .subscribe(response => {
          console.log(response, 'create success');
          this.dialogService.alert(this.currentLanguageSet.createdSuccessfully, 'success');
          this.emergencyContactForm.reset();
          this.getEmergencyList(this.providerServiceMapID, this.notificationTypeID);
          this.tableMode();
          this.bufferArray = [];
          //emergency contacts array pushed as single socket notification to all roles
          let roomArray = [];
          for(var i =0 ; i < this.roles.length; i++){
            roomArray.push(this.roles[i].roleName);
          }
          // this.notification_service.sendSocketNotification({
          //   "room":roomArray, type:"Emergency_Contact", "message":"Emergency Contacts added", "subject": array.length.toString()
          // })
          // .subscribe((response)=>{
          //   console.log(response.data);
          // },
          // (error)=>{
          //   console.log(error);
          // });
        }, err => {
          console.log('error', err);
          this.dialogService.alert(this.currentLanguageSet.failedToCreate, 'error');
        });
    }
  }

  // createEmergencyContact(form_value) {
  //   const obj = {
  //     'providerServiceMapID': this.providerServiceMapID,
  //     'notificationTypeID': this.notificationTypeID,
  //     'createdBy': this.createdBy,
  //     'designationID': form_value.designation,
  //     'emergContactName': form_value.name,
  //     'location': form_value.location,
  //     'emergContactNo': form_value.contactNumber
  //   }

  //   let reqArray: any = [];
  //   reqArray.push(obj);

  //   this.notification_service.createEmergencyContacts(reqArray)
  //     .subscribe(response => {
  //       console.log(response, 'create success');
  //       this.emergencyContactForm.reset();
  //       this.getEmergencyList(this.providerServiceMapID, this.notificationTypeID);
  //       this.tableMode();
  //     }, err => {
  //       console.log('error', err);
  //     });


  // }

  edit(object) {
    this.editMode();

    this.editData = object;

    this.name = object.emergContactName;
    this.designation = object.designation.designationID;
    this.location =  (object !=undefined && object !=null && object.location !=undefined && object.location !=null) ? object.location.trim() :null;
    this.contactNumber = (object !=undefined && object !=null && object.emergContactNo !=undefined && object.emergContactNo !=null) ? object.emergContactNo.trim() :null;

  }

  update(formvalue) {
    this.editData['emergContactName'] = formvalue.name;
    this.editData['designationID'] = formvalue.designation;
    this.editData['emergContactNo'] = (formvalue !=undefined && formvalue !=null && formvalue.contactNumber !=undefined && formvalue.contactNumber !=null) ? formvalue.contactNumber.trim() :null;
    this.editData['location'] = (formvalue !=undefined && formvalue !=null && formvalue.location !=undefined && formvalue.location !=null) ? formvalue.location.trim() :null;

    this.notification_service.updateEmergencyContacts(this.editData)
      .subscribe(response => {
        if (response.data) {
          console.log(response.data.response, 'edited successfully');
          this.dialogService.alert(this.currentLanguageSet.editedSuccessfully, 'success');
          this.editEmergencyContactForm.reset();
          this.getEmergencyList(this.providerServiceMapID, this.notificationTypeID);
          this.tableMode();
        }
      }, err => { 
        console.log(err, 'edit failed');
        this.dialogService.alert(this.currentLanguageSet.failedToEdit, 'error');
      });
  }

  activate(object, value) {
    let activateStatus=object.deleted;
    if (object.deleted) {
      object.deleted = value;
    }
    else {
      object['deleted'] = value;
    }
    this.dialogService.confirm('info', this.currentLanguageSet.wantToActivate).subscribe((userResponse) => {
      if (userResponse) {
    this.notification_service.updateEmergencyContactsActivateDeactivate(object)
      .subscribe(response => {
        if (response.data) {
          console.log(response.data.response, 'ACTIVATED SUCCESSFULLY');
          this.dialogService.alert(this.currentLanguageSet.activatedSuccessfully, 'success');
          this.getEmergencyList(this.providerServiceMapID, this.notificationTypeID);
        }
      }, err => {
        console.log(err, 'ACTIVATION FAILED');
        this.dialogService.alert(this.currentLanguageSet.failedToActivate, 'error');
        object.deleted=activateStatus;
      })
    }
    else
    {
      object.deleted=activateStatus;
    }
  })
  }

  deactivate(object, value) {
    let deactivateStatus=object.deleted;
    if (object.deleted) {
      object.deleted = value;
    }
    else {
      object['deleted'] = value;
    }
    this.dialogService.confirm('info', this.currentLanguageSet.wantToDeactivate).subscribe((userResponse) => {
      if (userResponse) {
    this.notification_service.updateEmergencyContactsActivateDeactivate(object)
      .subscribe(response => {
        if (response.data) {
          console.log(response.data.response, 'DEACTIVATED SUCCESSFULLY');
          this.dialogService.alert(this.currentLanguageSet.deactivatedSuccessfully, 'success');
          this.getEmergencyList(this.providerServiceMapID, this.notificationTypeID);
        }
      }, err => {
        console.log(err, 'DEACTIVATION FAILED');
        this.dialogService.alert(this.currentLanguageSet.failedToDeactivate, 'error');
        object.deleted=deactivateStatus;
      })
    }
    else{
      object.deleted=deactivateStatus;
    }
    })
  }
back() {
  this.tableMode();
  // this.bufferArray = [];
  this.filterComponentList(null);

}
  tableMode() {
    if(this.showForm === true)
    {
      this.emergencyContactForm.reset();
      this.bufferArray = [];
    }

    if(this.showEditForm === true)
    {
    this.editEmergencyContactForm.reset();
   
    }

    this.showTable = true;
    this.showForm = false;
    this.showEditForm = false;
  }

  formMode() {
    this.showTable = false;
    this.showForm = true;
    this.showEditForm = false;
  }

  editMode() {
    this.showTable = false;
    this.showForm = false;
    this.showEditForm = true;
  }
  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredsearchResult = this.emergencyList;
    } else {
      this.filteredsearchResult = [];
      this.emergencyList.forEach((item) => {
        for (let key in item) {
          if (key === 'emergContactName' || key === 'emergContactNo' || key === 'location') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredsearchResult.push(item); break;
            }
          }
        }
      });
    }

  }
}
