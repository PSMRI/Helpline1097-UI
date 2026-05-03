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


import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { dataService } from "./../services/dataService/data.service";
import { CallServices } from "./../services/callservices/callservice.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
import { tickStep } from "d3";
import { DoCheck } from "@angular/core";
import { QualityAuditService } from "app/services/supervisorServices/quality-audit-service.service";

declare var jQuery: any;

@Component({
  selector: "app-block-unblock-number",
  templateUrl: "./block-unblock-number.component.html",
  styleUrls: ["./block-unblock-number.component.css"],
})
export class BlockUnblockNumberComponent implements OnInit, DoCheck {
  phoneNumber: number;
  maxDate: Date;
  blockedDate: any;
  blockedTill: any;
  isBlockedType: boolean;
  showTable: boolean = false;
  isBlocked: boolean = undefined;
  isUnBlocked: boolean = undefined;
  reason: any;
  blockedBy: string;
  blockForm: FormGroup;
  serviceId: any;
  blackList: any = [];
  searchByPhone: boolean = false;
  data: any = [];
  recording_data: any = [];
  showRecordings: boolean = false;
  audio_path: any;
  ph_no = "";
  assignSelectedLanguageValue: any;
  audioResponse: any;
  dispFlag: any;
   recordingArray:any = [];
  apiCall: boolean=true;
  constructor(
    private commonData: dataService,
    private callService: CallServices,
    private message: ConfirmationDialogsService,
    private httpServices: HttpServices,
    private qualityAuditService: QualityAuditService,
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.isBlockedType = undefined;
    this.serviceId = this.commonData.current_service.serviceID;
    this.maxDate = new Date();
    this.addToBlockList();
  }

  getBlockedTillDate(date) {
    this.blockedTill = date.setDate(date.getDate() + 7);
    console.log(this.blockedTill);
  }

  addToBlockList() {
    const searchObj = {};
    searchObj["providerServiceMapID"] = this.serviceId;
    searchObj["phoneNo"] = this.phoneNumber;
    searchObj["is1097"] = true;
    // searchObj['isBlocked'] = this.isBlockedType;
    this.isBlocked = Boolean(this.isBlocked);
    this.callService.getBlackListCalls(searchObj).subscribe(
      (response) => {
        this.showTable = true;
        this.recording_data = [];
        this.showRecordings = false;
        this.setBlackLists(response);
      },
      (err) => {
        this.message.alert(err.errorMessage, "error");

        this.showTable = false;
      }
    );
  }
  setBlackLists(blackListData: any) {
    this.data = blackListData;
  }
  toUTCDate(date) {
    const _utc = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
    return _utc;
  }

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  }
  unblock(phoneBlockID: any) {
    const blockObj = {};
    blockObj["phoneBlockID"] = phoneBlockID;
    blockObj["is1097"] = true;
    this.callService.UnBlockPhoneNumber(blockObj).subscribe(
      (response) => {
        this.message.alert(this.assignSelectedLanguageValue.successfullyUnblocked, "success");
        this.addToBlockList();
        this.recording_data = [];
        this.showRecordings = false;
      },
      (err) => {
        this.message.alert(err.status, "error");
      }
    );
  }
  block(phoneBlockID: any) {
    const blockObj = {};
    blockObj["phoneBlockID"] = phoneBlockID;
    blockObj["is1097"] = true;
    this.callService.blockPhoneNumber(blockObj).subscribe(
      (response) => {
        this.message.alert(this.assignSelectedLanguageValue.successfullyBlocked, "success");
        this.addToBlockList();
        this.recording_data = [];
        this.showRecordings = false;
      },
      (err) => {
        this.message.alert(err.status, "error");
      }
    );
  }
  getBlackList(e: any) {
    if (!e.checked) {
      this.phoneNumber = undefined;
      this.addToBlockList();
    }
  }

  getRecording(obj) {
    this.dispFlag = 0;
    if (obj) {
      let requestObj = {
        calledServiceID: this.serviceId,
        phoneNo: obj.phoneNo,
        count: obj.noOfNuisanceCall,
        is1097: true,
      };

      this.callService.getRecording(requestObj).subscribe(
        (response) => this.getRecordingsSuccessHandeler(response, obj.phoneNo),
        (err) => this.message.alert(err.errorMessage, "error")
      );
    }
  }

  getRecordingsSuccessHandeler(response, ph_no) {
    console.log(response, "get RECORDINGS SUCCESS");
    if (response) {
      this.recording_data = response.workList != undefined ? response.workList : null;
      this.showRecordings = true;
      if (response.length > 0) {
        // this.audio_path = response[0].recordingPath;
      }
    }

    this.ph_no = ph_no;
  }
  /*
   * JA354063 - Created on 29-07-2021
   */
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }

  check(agentID,sessionID,index){
    console.log("AgentID",agentID);
    console.log("sessionID",sessionID);
    
   this.audioResponse=null;
  
    if(agentID>0 && sessionID>0 )
    {
       if(this.recordingArray.length > 0)
       {
      this.recordingArray.forEach(element => {
        if (sessionID === element.sessionId && agentID === element.agentId) {        
          this.audioResponse=element.path;
          this.dispFlag=index;
          this.apiCall=false;

        }
      })
    }
      if(this.apiCall)
      {
     
  
    this.qualityAuditService.getAudio(agentID,sessionID).subscribe(response =>
      {
        console.log("RESPONSEss", response.response);
        this.audioResponse = response.response;
        this.dispFlag=index;
       
        console.log("Audio Response1",this.audioResponse)
        this.recordingArray.push({sessionId:sessionID,agentId:agentID,path:this.audioResponse});
        console.log("RecordingArray",this.recordingArray)
      },
      err => {
        this.message.alert(this.assignSelectedLanguageValue.failedToGetTheVoiceFilePath, 'error');
            console.log("ERROR", err);
          }
      );
        
     }

      else
     {
      this.apiCall=true;
     }
        
    }
    
  }
  
}
