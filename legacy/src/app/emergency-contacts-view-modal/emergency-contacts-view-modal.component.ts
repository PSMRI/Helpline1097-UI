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


import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { dataService } from '../services/dataService/data.service';
import { NotificationService } from '../services/notificationService/notification-service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service'
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-emergency-contacts-view-modal',
  templateUrl: './emergency-contacts-view-modal.component.html',
  styleUrls: ['./emergency-contacts-view-modal.component.css']
})
export class EmergencyContactsViewModalComponent implements OnInit {

  //arrays
  contacts: any = [];

  //variables
  providerServiceMapID: any;
  emergencyContactID: any;
  currentLanguageSet: any;

  constructor(private dialog: MdDialog, public dialogRef: MdDialogRef<EmergencyContactsViewModalComponent>,
    private dataService: dataService, private notificationService: NotificationService, private alertService: ConfirmationDialogsService,
    private HttpServices:HttpServices) { }

  ngOnInit() {
    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.notificationService.getNotificationTypes(this.providerServiceMapID)
      .subscribe((response) => {
        console.log(response, "notification Types in emergency contact component");
        this.emergencyContactID = response.data.filter((notification) => {
          return notification.notificationType == "Emergency Contact";
        });
        let data = {
          "providerServiceMapID": this.providerServiceMapID,
          "notificationTypeID": this.emergencyContactID[0].notificationTypeID
        }
        this.notificationService.getEmergencyContacts(data).subscribe(response => {
          this.handleEmergencyContacts(response)
        },
          (err) => {
            this.alertService.alert(err.errorMessage, 'error');
            console.log(err);
          });
      },
      (err) => {
        console.log(err);
      });

      this.assignSelectedLanguage();

  }

  handleEmergencyContacts(res) {
    this.contacts = res;
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
}
