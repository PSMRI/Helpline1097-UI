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


import {
  Component,
  OnInit,
  OnChanges,
  ViewChild,
  Inject,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ConfigService } from "../services/config/config.service";
import { dataService } from "../services/dataService/data.service";
import { QualityAuditService } from "../services/supervisorServices/quality-audit-service.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { NgForm } from "@angular/forms";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from "@angular/material";
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";
// import * as jsPDF from 'jspdf';
// declare var jQuery: any;

@Component({
  selector: "app-quality-audit",
  templateUrl: "./quality-audit.component.html",
  styleUrls: ["./quality-audit.component.css"],
})
export class QualityAuditComponent implements OnInit {
  // qualityAuditURL: any;
  showCaseSheet = false;
  // arrays
  servicelines: any = [];
  agentIDs = [];
  allAgentIDs = [];
  roles = [];
  callTypes: any = [];
  callSubTypes: any = [];
  filteredCallList: any = [];

  // constants
  userID: any = "";
  providerServiceMapID: any = "";
  serviceProviderID: any = "";
  serviceID: any = "";

  // ngModels
  role: any;
  ioc: any;
  agent: any;
  phno: any;
  callGroupType: any;
  callsubtype: any;

  @ViewChild("qaForm") qaForm: NgForm;

  min: any;
  max: any;
  audioURL: string;
  audioTag: any;
  audioResponse: any;
  dispFlag: any;

  displayIcon: boolean = false;

  recordingArray: any = [];
  apiCall: boolean = true;
  currentLanguageSet: any;
  pageCount: any;
  pager: any;
  validFrom: Date;
  validTill: Date;
  pageNo: any = 1;
  pageSize = 5;
  today: Date;
  maxEndDate: Date;
  serviceDetails = [];

  constructor(
    public sanitizer: DomSanitizer,
    private commonData: dataService,
    private qualityAuditService: QualityAuditService,
    private alertService: ConfirmationDialogsService,
    public dialog: MdDialog,
    public HttpServices: HttpServices
  ) {}

  ngOnInit() {
    this.setTodaydate();
    this.assignSelectedLanguage();
    this.userID = this.commonData.Userdata.userID;
    this.serviceProviderID = this.commonData.serviceProviderID;
    this.providerServiceMapID = this.commonData.current_service.serviceID;
    this.currentDateCallRecordingRequest(this.pageNo);
    this.getServiceProviderID();
    this.currentDateCallRecordingRequest(this.pageNo);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  resetFlag() {
    this.dispFlag = 0;
  }
  check(agentID, sessionID, index) {
    console.log("AgentID", agentID);
    console.log("sessionID", sessionID);

    this.audioResponse = null;

    if (agentID > 0 && sessionID > 0) {
      if (this.recordingArray.length > 0) {
        this.recordingArray.forEach((element) => {
          if (sessionID === element.sessionId && agentID === element.agentId) {
            this.audioResponse = element.path;
            this.dispFlag = index;
            this.apiCall = false;
          }
        });
      }
      if (this.apiCall) {
        this.qualityAuditService.getAudio(agentID, sessionID).subscribe(
          (response) => {
            console.log("RESPONSEss", response.response);
            this.audioResponse = response.response;
            this.dispFlag = index;

            console.log("Audio Response1", this.audioResponse);
            this.recordingArray.push({
              sessionId: sessionID,
              agentId: agentID,
              path: this.audioResponse,
            });
            console.log("RecordingArray", this.recordingArray);
          },
          (err) => {
            this.alertService.alert(
              this.currentLanguageSet.failedToGetTheVoiceFilePath,
              "error"
            );
            console.log("ERROR", err);
          }
        );
      } else {
        this.apiCall = true;
      }
    }
  }

  setEndDate() {
    this.resetWorklistData();
    const timeDiff = this.validTill.getTime() - this.validFrom.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays >= 0) {
      if (diffDays > 31) {
        this.maxEndDate = new Date(this.validFrom);
        this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
        this.maxEndDate.setHours(23, 59, 59, 0);
        this.validTill = this.maxEndDate;
      }
      if (diffDays <= 31) {
        this.checkForEndDateDifference();
      }
    } else {
      this.checkForEndDateDifference();
    }
  }
  checkForEndDateDifference() {
    const endDateDiff = this.today.getTime() - this.validFrom.getTime();
    const enddiffDays = Math.ceil(endDateDiff / (1000 * 3600 * 24));
    if (enddiffDays > 31) {
      this.maxEndDate = new Date(this.validFrom);
      this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
      this.maxEndDate.setHours(23, 59, 59, 0);
      this.validTill = this.maxEndDate;
    } else {
      this.today.setHours(23, 59, 59, 0);
      this.validTill = this.today;
      this.maxEndDate = this.today;
    }
  }
  resetWorklistData() {
    this.filteredCallList = [];
    this.pager = 0;
  }
  setTodaydate() {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.validFrom = this.today;
    this.maxEndDate = new Date();
    this.maxEndDate.setHours(23, 59, 59, 0);
    this.validTill = this.maxEndDate;
  }

  currentDateCallRecordingRequest(pageNo) {
    const requestForCallrecords = {
      calledServiceID: this.providerServiceMapID,
      filterStartDate: new Date(
        this.validFrom.valueOf() -
          1 * this.validFrom.getTimezoneOffset() * 60 * 1000
      ),
      filterEndDate: new Date(
        this.validTill.valueOf() -
          1 * this.validTill.getTimezoneOffset() * 60 * 1000
      ),
      is1097: true,
      pageNo: pageNo,
    };
    this.getFilteredCallList(requestForCallrecords, pageNo);
  }

  callRecordingRequestFordate(pageNo, formValues) {
    this.filteredCallList = [];
    const requestForCallrecords = {
      calledServiceID: this.providerServiceMapID,
      callTypeID: formValues.CallSubType,
      filterStartDate: new Date(
        formValues.startDate.valueOf() -
          1 * formValues.startDate.getTimezoneOffset() * 60 * 1000
      ),
      filterEndDate: new Date(
        formValues.endDate.valueOf() -
          1 * formValues.endDate.getTimezoneOffset() * 60 * 1000
      ),
      receivedRoleName: formValues.Role ? formValues.Role : null,
      phoneNo: formValues.benPhoneNo ? formValues.benPhoneNo : null,
      agentID: formValues.Agent ? formValues.Agent : null,
      inboundOutbound: formValues.InboundOutbound
        ? formValues.InboundOutbound
        : null,
      is1097: true,
      pageNo: pageNo,
    };
    this.getFilteredCallList(requestForCallrecords, pageNo);
  }

  getFilteredCallList(requestForCallrecords, pageNo) {
    this.qualityAuditService
      .getFilteredCallList(requestForCallrecords)
      .subscribe(
        (response) => {
          if (!this.isWorkListHasData(response)) {
            console.log("Call recording are not there");
            return;
          }
          this.callAuditingWorklistPerPage(response, pageNo);
        },
        (err) => {
          console.log("TABLE DATA FETCHED ERROR", err.status);
          this.alertService.alert(err.status, "error");
          this.filteredCallList = [];
        }
      );
  }

  callAuditingWorklistPerPage(recordingsPerpage, pageNo) {
    this.filteredCallList = recordingsPerpage.workList;
    this.pageCount = recordingsPerpage.totalPages;
    if (this.pageCount !== 0) {
      this.pager = this.getPager(pageNo);
    }
  }

  getPager(pageNo) {
    let startPage: number, endPage: number;
    const totalPages = this.pageCount;
    // ensure current page isn't out of range
    if (pageNo > totalPages) {
      pageNo = totalPages;
    }
    if (totalPages <= 5) {
      // less than 5 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 5 total pages so calculate start and end pages
      if (pageNo <= 2) {
        startPage = 1;
        endPage = 5;
      } else if (pageNo >= totalPages - 1) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = pageNo - 2;
        endPage = pageNo + 2;
      }
    }
    return this.createPagination(endPage, startPage, pageNo, totalPages);
  }

  createPagination(endPage, startPage, pageNo, totalPages) {
    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      (i) => startPage + i
    );
    // return object with all pager properties required by the view
    return {
      currentPage: pageNo,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      pages: pages,
    };
  }
  isWorkListHasData(response) {
    return (
      response !== null &&
      response !== undefined &&
      response.workList.length > 0
    );
  }

  reset() {
    this.qaForm.resetForm();
    this.agent = undefined;
    this.agentIDs = this.allAgentIDs;
    this.setTodaydate();
    this.currentDateCallRecordingRequest(this.pageNo);
    this.getServicelines();
  }

  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  getServiceProviderID() {
    this.qualityAuditService
      .getServiceProviderID(this.providerServiceMapID)
      .subscribe(
        (response) => {
          console.log(response, "QA serviceproviderID success");
          this.serviceProviderID = response.serviceProviderID;
          this.getServicelines();
        },
        (err) => {
          console.log(err.errorMessage, "QA serviceProviderID error");
        }
      );
  }

  getServicelines() {
    this.qualityAuditService.getServices(this.userID).subscribe(
      (response) => {
        console.log(response, "QA servicelines success");
        this.servicelines = response.filter((item) => {
          return item.serviceName === "1097";
        });
        this.serviceID = this.servicelines[0].serviceID;
        this.getRoles();
      },
      (err) => {
        console.log(err, "QA servicelines error");
        this.alertService.alert(err.errorMessage, "error");
      }
    );
  }

  getRoles() {
    const obj = {
      serviceProviderID: this.serviceProviderID,
      serviceID: this.servicelines[0].serviceID,
      isNational: this.servicelines[0].isNational,
    };

    this.qualityAuditService.getRoles(obj).subscribe(
      (response) => {
        console.log(response, "QA roles success");
        this.roles = response;
        this.getAgents();
      },
      (err) => {
        console.log(err, "QA roles error");
        this.alertService.alert(err.errorMessage, "error");
      }
    );
  }

  getRoleSpecificAgents(role_name, roles_array) {
    this.resetWorklistData();
    let roleID = undefined;

    for (let i = 0; i < roles_array.length; i++) {
      if (role_name.toLowerCase() === roles_array[i].roleName.toLowerCase()) {
        roleID = roles_array[i].roleID;
        break;
      }
    }

    if (roleID != undefined) {
      this.qualityAuditService
        .getRoleSpecificAgents(this.providerServiceMapID, roleID)
        .subscribe(
          (response) => {
            this.agent = undefined;
            this.agentIDs = response;
          },
          (err) => {
            console.log(err, "Error while fetching role specific agent IDs");
          }
        );
    }
  }

  getAgents() {
    this.qualityAuditService.getAllAgents(this.providerServiceMapID).subscribe(
      (response) => {
        console.log(response, "QA AGENTIDs success");
        this.agentIDs = response;
        this.allAgentIDs = response;

        this.getCallTypes();
      },
      (err) => {
        console.log(err.errorMessage, "QA AGENTIDs error");
      }
    );
  }

  getCallTypes() {
    this.qualityAuditService.getCallTypes(this.providerServiceMapID).subscribe(
      (response) => {
        console.log(response, "QA calltypes success");
        this.callTypes = response.filter((item) => {
          return (
            item.callGroupType.toLowerCase() === "valid".toLowerCase() ||
            item.callGroupType.toLowerCase() === "invalid".toLowerCase()
          );
        });

        const obj = { callGroupType: "All", callTypes: [] };
        this.callTypes.push(obj);
      },
      (err) => {
        console.log(err.errorMessage, "QA calltypes error");
      }
    );
  }

  populateCallSubTypes(callGroupType) {
    this.resetWorklistData();
    if (callGroupType.toLowerCase() === "valid".toLowerCase()) {
      this.callSubTypes = this.callTypes.filter((item) => {
        if (item.callGroupType.toLowerCase() === "valid".toLowerCase()) {
          return item.callTypes;
        }
      });
    } else if (callGroupType.toLowerCase() === "invalid".toLowerCase()) {
      this.callSubTypes = this.callTypes.filter((item) => {
        if (item.callGroupType.toLowerCase() === "invalid".toLowerCase()) {
          return item.callTypes;
        }
      });
    } else {
      this.callSubTypes = [];
    }

    if (this.callSubTypes.length > 0) {
      let arr = [];
      for (const callSubType of this.callSubTypes) {
        console.log("callSubType", callSubType);
        arr = callSubType.callTypes;
        console.log("callSubType after", arr);
      }
      this.callsubtype = "";
      this.callSubTypes = arr;
    }
  }
  resetValuesOnchange() {
    this.resetWorklistData();
    this.validTill.setHours(23, 59, 59, 0);
  }
  setPage(pageNo: number, formValues) {
    this.audioResponse = [];
    this.recordingArray = [];
    this.resetFlag();
    if (pageNo <= this.pageCount && pageNo >= 1) {
      this.callRecordingRequestFordate(pageNo, formValues);
    }
  }

  invokeCaseSheetDialog(benCallID, beneficiaryData) {
    this.information_services = [];
    this.counselling_services = [];
    this.refferal_services = [];
    this.feedback_services = [];
    this.benData = beneficiaryData;
    this.showCaseSheet = true;

    this.qualityAuditService.getCallSummary(benCallID).subscribe(
      (response) => {
        console.log("success in getting call details(casesheet)", response);
        if (
          response !== undefined &&
          response !== null &&
          response.length > 0
        ) {
          // let obj = {
          //   response: response,
          //   benData: beneficiaryData,
          // };
          this.serviceDetails = response;
          if (this.serviceDetails.length > 0) {
            this.information_services = this.serviceDetails[0].informations;
            this.counselling_services = this.serviceDetails[0].counsellings;
            this.refferal_services = this.serviceDetails[0].referrals;
            this.feedback_services = this.serviceDetails[0].feedbacks;
          }
          // this.CaseSheetData = obj;
        }
      },
      (err) => {
        console.log(
          "error in getting call details(casesheet)",
          err.errorMessage
        );
      }
    );
  }
  information_services: any = [];
  counselling_services: any = [];
  refferal_services: any = [];
  feedback_services: any = [];

  item: any;
  benData: any;
  age: any;

  current_date = new Date();

  hideCaseSheetFunction() {
    this.showCaseSheet = false;
  }

  print() {
    window.print();
  }
}

@Component({
  selector: "app-case-sheet-summary-dialog",
  templateUrl: "./case-sheet-summary-dialog.html",
  styleUrls: ["./quality-audit.component.css"],
})
export class CaseSheetSummaryDialogComponent implements OnInit {
  information_services: any = [];
  counselling_services: any = [];
  refferal_services: any = [];
  feedback_services: any = [];

  item: any;
  benData: any;
  age: any;

  @Input() data;
  @Output() hideCaseSheet: EventEmitter<any> = new EventEmitter<any>();

  current_date = new Date();
  currentLanguageSet: any;
  constructor(public HttpServices: HttpServices) {}

  ngOnInit() {
    this.assignSelectedLanguage();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  calculateAge(date) {
    if (date) {
      const newDate = new Date(date);
      const today = new Date();
      let age = today.getFullYear() - newDate.getFullYear();
      const month = today.getMonth() - newDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < newDate.getDate())) {
        age--;
      }
      return age;
    } else {
      return undefined;
    }
  }

  hideCaseSheetFunction() {
    this.hideCaseSheet.emit({
      value: false,
    });
  }

  ngOnChange() {
    console.log("modal content", this.data);
    let response = [];
    response = this.data.response;
    this.benData = this.data.benData;
    if (response.length > 0) {
      this.information_services = response[0].informations;
      this.counselling_services = response[0].counsellings;
      this.refferal_services = response[0].referrals;
      this.feedback_services = response[0].feedbacks;
    }
    console.log(this.feedback_services, "FEEDBACK ARRAY");

    if (this.benData.beneficiaryModel != undefined) {
      this.age = this.calculateAge(this.benData.beneficiaryModel.dOB);
    }
  }
}
