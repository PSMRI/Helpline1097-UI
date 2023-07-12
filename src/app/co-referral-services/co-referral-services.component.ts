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


import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { LocationService } from "../services/common/location.service";
import { CoReferralService } from "../services/coService/co_referral.service";
import { dataService } from "../services/dataService/data.service"
import { Subscription } from 'rxjs/Subscription';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CoAlternateNumberComponent } from './co-alternate-number/co-alternate-number.component';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { CommonSmsDialogComponent } from '../common-sms-dialog/common-sms-dialog.component';
import { SmsTemplateService } from './../services/supervisorServices/sms-template-service.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

// Common service to pass Data
declare var jQuery: any;

import { CommunicationService } from './../services/common/communication.service'
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-co-referral-services',
  templateUrl: './co-referral-services.component.html',
  styleUrls: ['./co-referral-services.component.css']
})
export class CoReferralServicesComponent implements OnInit {
  currentLanguageSet: any;
@ViewChild('referralForm') referralForm: NgForm;
  @Input() resetProvideServices: any;

  @Output() referralServiceProvided: EventEmitter<any> = new EventEmitter<any>();

  showFormCondition: boolean = false;
  showTableCondition: boolean = true;

  tableArray: any = [];
  data: any = [];
  states: any = [];
  districts: any = [];
  taluks: any = [];
  blocks: any = [];
  branches: any = [];
  directory: any = [];
  sub_directory: any = [];
  detailsList: any = [];

  selected_state: any = undefined;
  selected_district: any = undefined;
  selected_taluk: any = undefined;
  selected_block: any = undefined;
  selected_branch: any = undefined;
  selected_directory: any = undefined;
  selected_sub_directory: any = undefined;
  description: any = undefined;
  subServiceID: number = 3;
  showSendSMS: boolean = false;
  providerServiceMapID: number;
  subscription: Subscription
  beneficiaryRegID: any = this.saved_data.beneficiaryRegID;
  p = 1;
  enableSms: boolean = false;
  showresult: boolean;
  constructor(
    private _userBeneficiaryData: UserBeneficiaryData,
    private _locationService: LocationService,
    private _coReferralService: CoReferralService,
    private saved_data: dataService,
    private pass_data: CommunicationService,
    private dialog: MdDialog,
    private message: ConfirmationDialogsService,
    private _smsService: SmsTemplateService, 
    public HttpServices: HttpServices
  ) {
  this.subscription = this.pass_data.getData().subscribe(message => { this.getBenData(message) });
    this.saved_data.beneficiary_regID_subject.subscribe(response => {
      this.setBenRegID(response);
    });
  }

  ngOnInit() {
    this.assignSelectedLanguage();

    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.GetServiceTypes();

    // call the api to get all the referrals done and store them in array;
    // this.tableArray = []; //substitute it with the response
    // // call the api to get all the states
    // this.states = [];  //substitute it with the response
    this._userBeneficiaryData.getUserBeneficaryData(this.saved_data.current_service.serviceID)
      .subscribe(response => this.SetUserBeneficiaryRegistrationData(response),
      (err) => {
        this.message.alert(err.errorMessage, 'error');
      });
    this.GetInformationDirectory();
  }
   ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
  tempFlag: boolean;
  // tslint:disable-next-line:use-life-cycle-interface

  setBenRegID(data) {
    this.beneficiaryRegID = data.beneficiaryRegID;
  }
  ngOnChanges() {
    if (this.resetProvideServices) {
      this.tempFlag = true;

      this.showTableCondition = true;
      this.showFormCondition = false;
      this.detailsList = [];
      this.showresult = false;
      // this.selected_state = undefined;

    }

  }

  GetServiceTypes() {
    this._coReferralService.getTypes(this.providerServiceMapID)
      .subscribe(response => this.setServiceTypes(response),
      (err) => {
        this.message.alert(err.errorMessage, 'error');
      });
  }
  setServiceTypes(response: any) {
    for (let i: any = 0; i < response.length; i++) {
      if (response[i].subServiceName.toUpperCase().search('REFE') >= 0) {
        this.subServiceID = response[i].subServiceID;
        break;
      }
    }
  }

  setBeneficiaryData() {
    this._coReferralService.getReferralHistoryByID(this.beneficiaryRegID, this.saved_data.current_service.providerServiceMapID)
      .subscribe(response => this.getReferralHistory(response),
      (err) => {
        this.message.alert(err.errorMessage, 'error');
      });
  }

  getReferralHistory(response: any) {
    console.log('referral history is :', response);
    // this.tableArray = response;
    if (response) {
      this.data = response;
    }
    else {
      this.message.alert(this.currentLanguageSet.noDataFound)
    }

  }

  showForm() {
    this.showFormCondition = true;
    this.showTableCondition = false;
    if (this.tempFlag) {
      jQuery('#referral').trigger("reset");
      this.tempFlag = false;
    }

  }

  showTable() {
    this.referralForm.resetForm();
    this.showFormCondition = false;
    this.showTableCondition = true;
    this.setBeneficiaryData();
    this.showresult = false;
  }

  SetUserBeneficiaryRegistrationData(regData: any) {
    if (regData.states) {
      this.states = regData.states;
    }
    if (regData.directory) {
      // this.directory = regData.directory;
    }
  }
  GetInformationDirectory() {
    this._locationService.getDirectory(this.providerServiceMapID).subscribe((response) => {
      this.directory = response.directory;
    }, (err) => {
      this.message.alert(err.errorMessage, 'error');

    });
  }
  GetDistricts(state: number) {
    this.districts = [];
    this.taluks = [];
    this.blocks = [];
    this.selected_district=null;
    this.selected_taluk=null;
    this._locationService.getDistricts(state)
      .subscribe(response => this.SetDistricts(response),
      (err) => {
        this.message.alert(err.errorMessage, 'error');
      });
  }
  SetDistricts(response: any) {
    this.districts = response;
  }
  GetTaluks(district: number) {
    this.taluks = [];
    this.blocks = [];
    this.selected_taluk=null;
    this._locationService.getTaluks(district)
      .subscribe(response => this.SetTaluks(response),
      (err) => {
        this.message.alert(err.errorMessage, 'error');
      });
  }
  SetTaluks(response: any) {
    this.taluks = response;
  }
  GetSDTB(taluk: number) {
    this.blocks = [];
    this._locationService.getBranches(taluk)
      .subscribe(response => this.SetSDTB(response),
      (err) => {
        this.message.alert(err.errorMessage, 'error');
      });
  }
  SetSDTB(response: any) {
    this.blocks = response;
  }

  GetSubDirectory(directoryID: number) {
    this._locationService.getSubDirectory(directoryID)
      .subscribe(response => this.SetSubDirectory(response),
      (err) => {
        this.message.alert(err.errorMessage, 'error');
      });
  }
  SetSubDirectory(response: any) {
    this.sub_directory = response.subDirectory;
  }

  GetReferralDetails() {
    this._coReferralService.getDetails(
      this.selected_directory, this.selected_sub_directory, this.selected_state, this.selected_district, this.selected_taluk,
      this.saved_data.uname, this.beneficiaryRegID, this.subServiceID, this.saved_data.callData.benCallID
    ).subscribe(response => this.SetReferralDetails(response),
      (err) => {
        this.message.alert(err.errorMessage, 'error');
      });
  }

  SetReferralDetails(response: any) {
    console.log('success referral', response);
    if (response) {
      this.showresult = true;

      this.detailsList = response;
      if (this.detailsList.length > 0) {
        this.showSendSMS = true;
      }
      else
      {
        this.message.alert(this.currentLanguageSet.noDataFound)
      }
      this.referralServiceProvided.emit();
      this.provideReferralDescription();
    }

  }

  provideReferralDescription() {
    
    this.setBeneficiaryData();

  }
  getBenData(benData: any) {
    this.beneficiaryRegID = benData.dataPass.beneficiaryRegID ? benData.dataPass.beneficiaryRegID : this.saved_data.beneficiaryRegID;
    this.setBeneficiaryData();
  }
  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };

  sendSMS() {
    let dialogReff = this.dialog.open(CommonSmsDialogComponent, {
      disableClose: true,
      width: '420px',
      data: {
        'statement': undefined,
        'generatedID': this.ref_array
      }
    });

    dialogReff.afterClosed().subscribe(result => {
      if (result) {
        // this.message.alert('Message sent to alternate number', 'success');
        this.send_sms(this.ref_array, result)
      }
      else {
        let primaryNumber = this.saved_data.callerNumber;
        // this.message.alert('Message sent to primary number', 'success');
        this.send_sms(this.ref_array)

      }
    });
  }

  ref_array = [];
  row_array = [];
  toggleSms(e: any, id, obj) {
    if (e.checked) {
      this.ref_array.push(id);
      this.row_array.push(obj);
    } else {

      this.row_array.splice(this.ref_array.indexOf(id), 1);
      this.ref_array.splice(this.ref_array.indexOf(id), 1);
    }

    if (this.ref_array.length == 0) {
      this.enableSms = false;
    } else {
      this.enableSms = true;
    }
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }


  /* 9 July,2018
	Author:Diamond Khanna
	Purpose: SMS sending */
  send_sms(generated_ben_ids, alternate_Phone_No?) {

    let sms_template_id = '';
    let smsTypeID = '';
    let currentServiceID = this.saved_data.current_serviceID;
    if (currentServiceID != undefined) {
      this._smsService.getSMStypes(currentServiceID)
        .subscribe(response => {
          if (response != undefined) {
            if (response.length > 0) {
              for (let i = 0; i < response.length; i++) {
                if (response[i].smsType.toLowerCase() === 'Referral SMS'.toLowerCase()) {
                  smsTypeID = response[i].smsTypeID;
                  break;
                }
              }
            }
          }

          if (smsTypeID != '') {
            this._smsService.getSMStemplates(this.saved_data.current_service.serviceID,
              smsTypeID).subscribe(res => {
                if (res != undefined) {
                  if (res.length > 0) {
                    for (let j = 0; j < res.length; j++) {
                      if (res[j].deleted === false) {
                        sms_template_id = res[j].smsTemplateID;
                        break;
                      }
                    }
                  }
                  if (smsTypeID != '') {
                    let req_arr = [];
                    for (let i = 0; i < this.ref_array.length; i++) {
                      let Obj = {
                        'alternateNo': alternate_Phone_No,
                        'createdBy': this.saved_data.uname,
                        'is1097': true,
                        'providerServiceMapID': this.saved_data.current_service.serviceID,
                        'smsTemplateID': sms_template_id,
                        'smsTemplateTypeID': smsTypeID,
                        'instituteID': this.ref_array[i],
                        'stateID': this.row_array[i].stateID,
                        'districtID': this.row_array[i].districtID,
                        'blockID': this.row_array[i].blockID,
                        'beneficiaryRegID': this.beneficiaryRegID
                      }

                      req_arr.push(Obj);
                    }


                    this._smsService.sendSMS(req_arr)
                      .subscribe(ressponse => {
                        console.log(ressponse, 'SMS Sent');
                        alert(this.currentLanguageSet.smsSent);
                      }, err => {
                        console.log(err, 'SMS not sent Error');
                      })
                  }
                }
              }, err => {
                console.log(err, 'Error in fetching sms templates');
              })
          }
        }, err => {
          console.log(err, 'error while fetching sms types');
        });
    } else {
      console.log('Service ID not found')
    }


  }



}
