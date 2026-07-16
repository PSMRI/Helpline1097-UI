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
import { OutboundReAllocationService } from "../services/outboundServices/outbound-call-reallocation.service";
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { CallServices } from '../services/callservices/callservice.service'
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

declare var jQuery: any;

@Component({
  selector: 'everwell-reallocate',
  templateUrl: './callReallocate.component.html',
  styleUrls: ['./callReallocate.component.css']
})
export class CallReAllocateComponent implements OnInit {

  providerServiceMapID: any;
  users = [];
  @ViewChild('reallocationForm') reallocationForm: NgForm;
  onAgentSelected: boolean = false;
  showFlag: boolean = false;
  records: any;
  postData: any;
  searchAgent: any;
  selectedAgent: any;
  totalAgentRecords = [];
  roles = [];
  search_role: any;
  agentName: any;
  languages = [];
  searchLanguage: any;

  startDatee: Date;
  endDatee: Date;

  startMinDate: Date;
  endMinDate: Date;

  a: any = [];
  currentLanguageSet: any;

  constructor(private OCRService: OutboundReAllocationService,
    private getCommonData: dataService, private alertService: ConfirmationDialogsService,
    private _callServices: CallServices,
    private HttpServices:HttpServices
  ) { }

  ngOnInit() {
    this.providerServiceMapID = this.getCommonData.current_service.serviceID;
    this.getLanguages();
    this.OCRService.getRoles({
      "providerServiceMapID": this.providerServiceMapID
    }).subscribe((response) => {
      this.roles = response;
      this.roles = this.roles.filter((obj) => {
        if(obj !=undefined && obj !=null && obj.roleName !=undefined && obj.roleName !=null)
        return obj.roleName.trim().toUpperCase() != "PROVIDERADMIN" && obj.roleName.trim().toUpperCase() != "SUPERVISOR";
      });

    }),(err) => {
      this.alertService.alert(err.errorMessage,'error');

    }


    // this.startMinDate=new Date();
    // this.startDatee=new Date();

    // this.endMinDate=new Date();
    // this.endMinDate.setDate(this.endMinDate.getDate()+7);
    // this.endDatee=this.endMinDate;
    this.assignSelectedLanguage();
  }

  updateMinValue(d) {

    this.endMinDate.setDate(d.getDate() + 7);

    this.endDatee = new Date(this.endMinDate);

  }

  getAgents(roleID: any) {
    this.OCRService.getAgents(this.providerServiceMapID, roleID)
      .subscribe((response) => {
        this.users = response;

      }),(err) => {
        this.alertService.alert(err.errorMessage,'error');
      }
    this.reallocationForm.form.patchValue({
      userID: []
    });
  }

  getLanguages() {
    this._callServices.getLanguages().subscribe(response => {
      this.languages = response;
    }, (err) => {
      this.alertService.alert(err.errorMessage,'error');

    });
  }

  onSubmit() {
    this.onAgentSelected = false;
    this.showFlag = false;

    this.agentName = this.searchAgent.firstName + " " + this.searchAgent.lastName;

    this.postData = {
      "providerServiceMapId": this.providerServiceMapID,
      "agentId": this.reallocationForm.value.agentName.userID
      // "preferredLanguageName": this.reallocationForm.value.preferredLanguage.languageName
    };
    if (this.reallocationForm.value.startDate != '' && this.reallocationForm.value.startDate != null) {
      this.postData["filterStartDate"] = new Date((this.reallocationForm.value.startDate) - 1 * (this.reallocationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
    }
    if (this.reallocationForm.value.endDate != '' && this.reallocationForm.value.endDate != null) {
      this.postData["filterEndDate"] = new Date((this.reallocationForm.value.endDate) - 1 * (this.reallocationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z";
    }

    this.onAgentSelected = false;
    this.OCRService.getEverwellReallocationCalls(this.postData)
      .subscribe((resProviderData) => {

        this.totalAgentRecords = resProviderData;
        if (this.totalAgentRecords.length == 0) {
          
          this.alertService.alert(this.currentLanguageSet.noRecordsAvailable);
        }
        else {
          this.onAgentSelected = true;
        }
      },
      (error) => {
        this.alertService.alert(error.errorMessage,'error');

        console.error(error);
      });
  }

  reallocationDone() {
    this.showFlag = false;
    //refreshing reallocation screen
    this.OCRService.getEverwellReallocationCalls(this.postData)
      .subscribe((resProviderData) => {

        // this.alertService.alert("Moved to Bin Successfully");
        this.totalAgentRecords = resProviderData;
      },
      (error) => {
        this.alertService.alert(error.errorMessage,'error');

        console.error(error);
      });
  }

  moveToBin(language, event) {

    let values = [];
    let reqObj = {
      "providerServiceMapId": this.providerServiceMapID,
      "agentId": this.reallocationForm.value.agentName.userID,
      "preferredLanguageName": language     
    }

    if (this.reallocationForm.value.startDate != '' && this.reallocationForm.value.startDate != null) {
      reqObj["filterStartDate"] = new Date((this.reallocationForm.value.startDate) - 1 * (this.reallocationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
    }
    if (this.reallocationForm.value.endDate != '' && this.reallocationForm.value.endDate != null) {
      reqObj["filterEndDate"] = new Date((this.reallocationForm.value.endDate) - 1 * (this.reallocationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z";
    }

    this.OCRService.getEverwellOutboundCallList(reqObj).subscribe(response => {

      values = response;

      var tempArray = [];
      for (var i = 0; i < values.length; i++) {
        tempArray.push(values[i].eapiId);
      }

      this.OCRService.everwellMoveToBin({
        "eapiIds": tempArray
      }).subscribe((response) => {

        // movedToBinSuccessfully
        this.alertService.alert(this.currentLanguageSet.movedToBinSuccessfully,'success');
        // refreshing after moving to bin
        this.reallocationDone();
      },
        (error) => {
          this.alertService.alert(error.errorMessage,'error');
          console.error(error);
        })
    }),(err) => {
      this.alertService.alert(err.errorMessage,'error');
    }


  }

  allocateCalls(language: any, event) {

    this.selectedAgent = {
      "agentName": this.agentName,
      "roleID": this.search_role,  
      "languageName": language,   
      "assignedUserID": this.reallocationForm.value.agentName.userID
    }

    let reqObj = {
      "providerServiceMapId": this.providerServiceMapID,
      "agentId": this.reallocationForm.value.agentName.userID,
      "preferredLanguageName": language
    }

    if (this.reallocationForm.value.startDate != '' && this.reallocationForm.value.startDate != null) {
      reqObj["filterStartDate"] = new Date((this.reallocationForm.value.startDate) - 1 * (this.reallocationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
    }
    if (this.reallocationForm.value.endDate != '' && this.reallocationForm.value.endDate != null) {
      reqObj["filterEndDate"] = new Date((this.reallocationForm.value.endDate) - 1 * (this.reallocationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z";
    }

    this.OCRService.getEverwellOutboundCallList(reqObj).subscribe(response => this.success(response),
  (err)=> {
    this.alertService.alert(err.errorMessage,'error');
  });
    this.records = {
      'outboundList': this.a
    }   
    this.records['langaugeName'] = { "langName": language };
    this.records['assignedUserID'] = this.reallocationForm.value.agentName.userID;

    if (event.target.className == "mat-button-wrapper") {
      for (var i = 0; i < event.target.parentNode.parentNode.parentNode.parentNode.children.length; i++) {
        event.target.parentNode.parentNode.parentNode.parentNode.children[i].className = "";
      }
      event.target.parentNode.parentNode.parentNode.className = "highlightTrBg";
    }
    else {
      for (var i = 0; i < event.target.parentNode.parentNode.parentNode.children.length; i++) {
        event.target.parentNode.parentNode.parentNode.children[i].className = "";
      }
      event.target.parentNode.parentNode.className = "highlightTrBg";
    }
    this.showFlag = true;


  }
  success(res) {

    // debugger;
    this.a = res;
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
