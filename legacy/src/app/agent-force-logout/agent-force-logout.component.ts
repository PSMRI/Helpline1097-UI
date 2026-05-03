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
import { MdDialog, MdDialogRef } from '@angular/material';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service'
import { ForceLogoutService } from './../services/supervisorServices/forceLogoutService.service';
import { NgForm } from '@angular/forms';
import { HttpServices } from '../services/http-services/http_services.service';
import { SetLanguageComponent } from 'app/set-language.component';
@Component({
  selector: 'app-agent-force-logout',
  templateUrl: './agent-force-logout.component.html',
  styleUrls: ['./agent-force-logout.component.css']
})
export class AgentForceLogoutComponent implements OnInit {

  providerServiceMapID: any;
  @ViewChild('forceLogoutForm') agentForceLogoutForm: NgForm;
  currentLanguageSet: any;

  constructor(private dialog: MdDialog,
    public dialogRef: MdDialogRef<AgentForceLogoutComponent>,
    private commonData: dataService,
    private alertService: ConfirmationDialogsService,
    private forceLogoutService: ForceLogoutService,private HttpServices:HttpServices) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.commonData.current_service.serviceID;
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
  kickout(obj) {
    obj['providerServiceMapID'] = this.providerServiceMapID;
    this.forceLogoutService.agentForceLogout(obj)
      .subscribe(response => {
        console.log(response, 'Success post agent force logout');
        this.alertService.alert(this.currentLanguageSet.userLoggedOutSuccessfully, 'success');
        this.agentForceLogoutForm.reset();
        this.dialogRef.close();
      }, err => {
        console.log(err, 'error post agent force logout');
        this.alertService.alert(err.errorMessage, 'error');
      });
  }

}
