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


import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef, Renderer } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OutboundCallAllocationService } from '../services/outboundServices/outbound-call-allocation.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { OutboundSearchRecordService } from '../services/outboundServices/outbound-search-records.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'app-everwell-allocate-records',
  templateUrl: './everwell-allocate-records.component.html',
  styleUrls: ['./everwell-allocate-records.component.css']
})

export class EverwellAllocateRecordsComponent implements OnInit {
  public showCreateFlag = false;
  serviceProviders: string[];
  data: any;
  totalNewRecords: any;
  totalRecords: any;
  AllocateNoOfRecords: any;
  users: any = [];
  userID: any;
  roleID: any;
  savedRes: any;
  allocateNo: any;
  roles: any = [];
  providerServiceMapID: number;
  @Input() outboundCallRequests: any;
  afterAllocate: boolean = true;
  allocateEverwellForm: FormGroup;
  showAgents: boolean = false;
  //  @ViewChild('allocateForm') outboundForm;
  // @ViewChild('allocateForm') allocateForm: NgForm;
  @Output() outboundCount: EventEmitter<any> = new EventEmitter<any>();
  @Input() filterAgent: any = '';
  @Input() reallocationFlag: boolean = false;
  @Output() everwellrefreshScreen: EventEmitter<any> = new EventEmitter<any>();
  initialCount: number;
  @ViewChild('allocateRef') input: ElementRef;
  selectedLanguage: any;
  currentLanguageSet: any;

  constructor(
    private _OCAService: OutboundCallAllocationService,
    private saved_data: dataService,
    private alertMessage: ConfirmationDialogsService,
    private fb: FormBuilder,
    private _OSRService: OutboundSearchRecordService,
    private renderer: Renderer,
    private HttpServices:HttpServices
  ) {
    this.createForm();
  }

  ngOnInit() {    
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    // this.roles = this.saved_data.userPriveliges[0].roles;
    this.getRoles();
    // this.initialCount = this.outboundCallRequests.length;
    // this.outboundCallRequests = this.outboundCallRequests;
    //  this.getOutboundCall(this.providerServiceMapID);
    this.assignSelectedLanguage();
  }

  getOutboundCall(serviceProviderMapID, startDate?: any, endDate?: any, agentId?:any,language?: any, isAllocated?:boolean) {  
    let fromdate = new Date((startDate) - 1 * (startDate.getTimezoneOffset() * 60 * 1000)).toJSON() ? new Date((startDate) - 1 * (startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z" : null;
    let toDate= new Date((endDate) - 1 * (endDate.getTimezoneOffset() * 60 * 1000)).toJSON() ? new Date((endDate) - 1 * (endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z" : null;
    this._OSRService.getEverwellUnallocatedCalls(serviceProviderMapID,fromdate, toDate, language, agentId)
      .subscribe(resProviderData => {
        this.initialCount =resProviderData.length;
        this.allocateEverwellForm.controls['outboundCallRequests'].setValue(resProviderData.data);
      }, err => {
        this.alertMessage.alert(err.errorMessage, 'error');
      });
  }

  createForm() {
    this.allocateEverwellForm = this.fb.group({
      roleID: ['', Validators.required],
      agentId: ['', Validators.required], // <--- the FormControl called "name"
      allocateNo: ['', Validators.required],
      outboundCallRequests: [null]
    });
  }
  getRoles() {
    this._OCAService.getRolesbyProviderID(this.providerServiceMapID)
      .subscribe(response => {
        console.log(response);
        this.roles = response.filter((item) => {
          return item.roleName.toLowerCase() !== 'supervisor' && item.roleName.toLowerCase() !== 'provideradmin';
        })
      }
      ), (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');

      };
  }
  getAgents(roleID: any) {
    let languageName;
    if (this.outboundCallRequests.langaugeName) {
      languageName = this.outboundCallRequests.langaugeName.langName;
    }
    this._OCAService.getEverwellAgentsbyRoleID(this.providerServiceMapID, roleID, languageName)
      .subscribe(resProviderData => {
        console.log('reading...')
        if (resProviderData.length > 0) {
          this.users = resProviderData;
          if (this.filterAgent != '') {
            this.users = this.users.filter((obj) => {
              return (obj.FirstName + " " + obj.LastName) != this.filterAgent.agentName;
            });
            if (this.users.length > 0) {
              this.showAgents = false;
            }
            else {
              this.showAgents = true;
            }
          }
        }
        else {
          this.showAgents = true;
        }
      }), (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');
      }
  }

  getAgentsbyLanguageName(roleID: any, languageName) {
    this._OCAService.getAgentsbyRoleID(this.providerServiceMapID, roleID, languageName)
      .subscribe(resProviderData => {
        this.users = resProviderData;
        if (this.filterAgent != '') {
          this.users = this.users.filter((obj) => {
            return (obj.firstName + " " + obj.lastName) != this.filterAgent.agentName;
          })
        }
      }), (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');
      }
  }

  ngOnChanges() {

    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.allocateEverwellForm.reset();
    this.users = [];
    this.showAgents = false;
    this.getUnallocateCall(this.providerServiceMapID, this.outboundCallRequests);
    //  this.initialCount = this.outboundCallRequests.length;

    // this.allocateForm.controls['outboundCallRequests'].setValue(this.outboundCallRequests.outboundList);
    // this.outboundCallRequests = this.outboundCallRequests;
    this.afterAllocate = true;
    this.allocateEverwellForm.patchValue({
      userID: []
    });
    if (this.reallocationFlag) {
      this.selectedLanguage = this.filterAgent.languageName;
      this.allocateEverwellForm.controls['roleID'].setValue(this.filterAgent.roleID);
      this.providerServiceMapID = this.saved_data.current_service.serviceID;
      this.getAgentsbyLanguageName(this.filterAgent.roleID, this.filterAgent.languageName);
    }
  }

  onCreate(val: any) {
    this._OCAService.allocateEverwellCallsToAgenta(this.allocateEverwellForm.value)
      .subscribe(
      (response) => {
        this.alertMessage.alert(`${this.currentLanguageSet.callAllocatedSuccessfully}`, 'success');
        this.afterAllocate = false;
        let obj = {};
        console.log("outboundCallRequests",this.outboundCallRequests);
        if (this.outboundCallRequests.startDate) {
          obj['startDate'] = this.outboundCallRequests.startDate;
          obj['endDate'] = this.outboundCallRequests.endDate;
        }
        obj['providerServiceMapId'] = this.providerServiceMapID;

        // if (this.outboundCallRequests.langaugeName) {
        //   obj['language'] = this.outboundCallRequests.langaugeName.langName;
        // }
        console.log("object",obj);
        this.outboundCount.emit(obj);
        this.everwellrefreshScreen.emit();
        // this.getUnallocateCall(this.providerServiceMapID);
      },
      (error) => {
        this.alertMessage.alert(error.errorMessage, 'error');
      });
  }

  blockKey(e: any) {
    if ((e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8 || e.keyCode == 9) {
      return true;
    }
    else {
      return false;
    }
  }

  validate(key, value) {
    var tempObj = {};
    if (value < 1) {
      tempObj[key] = undefined;
      this.allocateEverwellForm.patchValue(tempObj);
    }
    else if (value > this.initialCount) {
      tempObj[key] = this.initialCount;
      this.allocateEverwellForm.patchValue(tempObj)
    }
  }

  OnSelectChange() {
    let outboundlistCount = this.allocateEverwellForm.get('outboundCallRequests').value;
    console.log("First",outboundlistCount);
    console.log("Second",this.allocateEverwellForm.value.agentId);
    console.log("outboundlistCount.length",outboundlistCount.length);
    console.log("this.allocateEverwellForm.value.agentId.length",this.allocateEverwellForm.value.agentId.length);
    let tempValue = Math.floor(outboundlistCount.length / this.allocateEverwellForm.value.agentId.length);
    this.initialCount = tempValue;
    this.allocateEverwellForm.patchValue({
      allocateNo: tempValue
    });

  }
  // getUnallocateCall(serviceProviderMapId) {
  //   // tslint:disable-next-line:max-line-length
  //   let startDate: Date = new Date(this.outboundCallRequests.startDate);
  //   startDate.setHours(0);
  //   startDate.setMinutes(0);
  //   startDate.setSeconds(0);
  //   let endDate: Date = new Date(this.outboundCallRequests.endDate);
  //   endDate.setHours(23);
  //   endDate.setMinutes(59);
  //   endDate.setSeconds(59);
  //   let startDate:Date;
  //   let endDate:Date;
  //   this.getOutboundCall(serviceProviderMapId, startDate,
  //     endDate, this.filterAgent.languageName, this.filterAgent.assignedUserID);
  // }
  getUnallocateCall(serviceProviderMapId, value) {
    // tslint:disable-next-line:max-line-length
    console.log(value, "value");    
    let startDate: Date = new Date(value.startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    let endDate: Date = new Date(value.endDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    this.getOutboundCall(serviceProviderMapId, startDate,
      endDate, value.assignedUserID,value.langaugeName.langName, false);
    //this.getOutboundCall(serviceProviderMapId, value.assignedUserID, false);
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


