import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from '../services/config/config.service';
import { dataService } from '../services/dataService/data.service';
import { QualityAuditService } from '../services/supervisorServices/quality-audit-service.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-quality-audit',
  templateUrl: './quality-audit.component.html',
  styleUrls: ['./quality-audit.component.css']
})
export class QualityAuditComponent implements OnInit {
  // qualityAuditURL: any;

  // arrays
  servicelines: any = [];
  agentIDs = [];
  roles = [];
  callTypes: any = [];
  callSubTypes: any = [];
  filteredCallList: any = [];

  // constants
  userID: any = '';
  providerServiceMapID: any = '';
  serviceProviderID: any = '';
  serviceID: any = '';

  // ngModels
  role: any;
  ioc: any;
  agent: any;
  phno: any;
  callGroupType: any;
  callsubtype: any;

  @ViewChild('qaForm') qaForm: NgForm;

  min: any;
  max: any;


  constructor(
    private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private commonData: dataService,
    private qualityAuditService: QualityAuditService,
    private alertService: ConfirmationDialogsService,
    public dialog: MdDialog
  ) { }

  ngOnInit() {
    var currentDate = new Date();
    this.setMinMaxDate(currentDate);

    // let url = this.configService.getTelephonyServerURL() + "adminui.php?voice_logger";
    // console.log("url = " + url);
    // this.qualityAuditURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.userID = this.commonData.Userdata.userID;
    this.serviceProviderID = this.commonData.serviceProviderID;
    this.providerServiceMapID = this.commonData.current_service.serviceID;
    this.getFilteredCallList_default();
    this.getServiceProviderID();

    // this.getServicelines();
    // this.getAgents();
    // this.getCallTypes();
  }

  setMinMaxDate(startDate) {
    startDate.setHours(0, 0, 0, 0);
    this.qaForm.form.patchValue({ 'startDate': new Date(startDate) });
    // startDate.setHours(0, 0, 0, 0);
    this.min = new Date(startDate);

    var date = new Date();
    date.setDate(startDate.getDate() + 14);
    date.setHours(23, 59, 59, 0)


    let currentDate = new Date();
    currentDate.setHours(23, 59, 59, 0);

    if (date > currentDate) {
      this.max = new Date(currentDate);
    } else {
      this.max = new Date(date);
    }
  }

  setEndDate(endDate) {
    this.qaForm.form.patchValue({ 'endDate': new Date(endDate.setHours(23, 59, 59, 0)) });
  }

  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  getServiceProviderID() {
    this.qualityAuditService.getServiceProviderID(this.providerServiceMapID)
      .subscribe(response => {
        console.log(response, 'QA serviceproviderID success');
        this.serviceProviderID = response.serviceProviderID;
        this.getServicelines();
      }, err => {
        console.log(err.errorMessage, 'QA serviceProviderID error');
      });
  }

  getServicelines() {
    this.qualityAuditService.getServices(this.userID)
      .subscribe(response => {
        console.log(response, 'QA servicelines success');
        this.servicelines = response.filter(item => {
          return item.serviceName === '1097';
        });
        this.serviceID = this.servicelines[0].serviceID;
        this.getRoles();
      }, err => {
        console.log(err, 'QA servicelines error');
        this.alertService.alert(err.errorMessage, 'error');
      });
  }

  getRoles() {
    const obj = {
      'serviceProviderID': this.serviceProviderID,
      'serviceID': this.servicelines[0].serviceID,
      'isNational': this.servicelines[0].isNational
    }

    this.qualityAuditService.getRoles(obj)
      .subscribe(response => {
        console.log(response, 'QA roles success');
        this.roles = response;
        this.getAgents();
      }, err => {
        console.log(err, 'QA roles error');
        this.alertService.alert(err.errorMessage, 'error');
      });
  }

  getAgents() {
    this.qualityAuditService.getAllAgents(this.providerServiceMapID)
      .subscribe(response => {
        console.log(response, 'QA AGENTIDs success');
        this.agentIDs = response;
        this.getCallTypes();
      }, err => {
        console.log(err.errorMessage, 'QA AGENTIDs error');
      })
  }

  getCallTypes() {
    this.qualityAuditService.getCallTypes(this.providerServiceMapID)
      .subscribe(response => {
        console.log(response, 'QA calltypes success');
        this.callTypes = response.filter(function (item) {
          return item.callGroupType.toLowerCase() === 'valid'.toLowerCase()
            || item.callGroupType.toLowerCase() === 'invalid'.toLowerCase();
        });

        const obj = { 'callGroupType': 'All', 'callTypes': [] };
        this.callTypes.push(obj);
      }, err => {
        console.log(err.errorMessage, 'QA calltypes error');
      });
  }

  populateCallSubTypes(callGroupType) {
    if (callGroupType.toLowerCase() === 'valid'.toLowerCase()) {
      this.callSubTypes = this.callTypes.filter(function (item) {
        if (item.callGroupType.toLowerCase() === 'valid'.toLowerCase()) {
          return item.callTypes;
        }
      })
    } else if (callGroupType.toLowerCase() === 'invalid'.toLowerCase()) {
      this.callSubTypes = this.callTypes.filter(function (item) {
        if (item.callGroupType.toLowerCase() === 'invalid'.toLowerCase()) {
          return item.callTypes;
        }
      })
    } else {
      this.callSubTypes = [];
    }


    if (this.callSubTypes.length > 0) {
      let arr = [];
      for (let i = 0; i < this.callSubTypes.length; i++) {
        arr = this.callSubTypes[i].callTypes;
      }
      this.callsubtype = '';
      this.callSubTypes = arr;
    }
  }

  getFilteredCallList(formval) {
    console.log('formvalues', formval);
    let obj = {
      'calledServiceID': this.providerServiceMapID,
      'callTypeID': formval.CallSubType,
      'filterStartDate': new Date(formval.startDate.valueOf() - 1 * formval.startDate.getTimezoneOffset() * 60 * 1000),
      'filterEndDate': new Date(formval.endDate.valueOf() - 1 * formval.endDate.getTimezoneOffset() * 60 * 1000),
      'receivedRoleName': formval.Role ? formval.Role : undefined,
      'phoneNo': formval.benPhoneNo ? formval.benPhoneNo : undefined,
      'agentID': formval.Agent ? formval.Agent : undefined,
      'inboundOutbound': formval.InboundOutbound ? formval.InboundOutbound : undefined,
      'is1097': true
    }

    this.qualityAuditService.getFilteredCallList(obj)
      .subscribe(response => {
        console.log('TABLE DATA FETCHED', response);
        this.filteredCallList = response;
      }, err => {
        console.log('TABLE DATA FETCHED ERROR', err.status);
        this.alertService.alert(err.status, 'error');
        this.filteredCallList = [];
      });
  }

  getFilteredCallList_default() {
    let date = new Date();
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 0);

    date.setDate(date.getDate() - 14);
    let startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);


    let obj = {
      'calledServiceID': this.providerServiceMapID,
      'filterStartDate': new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
      'filterEndDate': new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000),
      'is1097': true
    }

    this.qualityAuditService.getFilteredCallList(obj)
      .subscribe(response => {
        console.log('TABLE DATA FETCHED first time', response);
        this.filteredCallList = response;
      }, err => {
        console.log('TABLE DATA FETCHED ERROR', err.errorMessage);
        this.alertService.alert(err.errorMessage, 'error');
        this.filteredCallList = [];
      });
  }

  reset() {
    this.qaForm.resetForm();
    this.getFilteredCallList_default();
  }

  invokeCaseSheetDialog(benCallID, beneficiaryData) {
    this.qualityAuditService.getCallSummary(benCallID)
      .subscribe(response => {
        console.log('success in getting call details(casesheet)', response);
        if (response) {
          let obj = {
            'response': response,
            'benData': beneficiaryData
          }
          let casesheetDialogReff = this.dialog.open(CaseSheetSummaryDialogComponent, {
            width: '800px',
            disableClose: true,
            data: obj
          });
        }
      }, err => {
        console.log('error in getting call details(casesheet)', err.errorMessage);
      })
  }



}


@Component({
  selector: 'app-case-sheet-summary-dialog',
  templateUrl: './case-sheet-summary-dialog.html',
  styleUrls: ['./quality-audit.component.css']

})
export class CaseSheetSummaryDialogComponent {

  information_services: any = [];
  counselling_services: any = [];
  refferal_services: any = [];
  feedback_services: any = [];

  item: any;
  benData: any;
  age: any;

  current_date = new Date();
  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public dialogRef: MdDialogRef<CaseSheetSummaryDialogComponent>,
    private commondata: dataService,
    private alertService: ConfirmationDialogsService) {
    console.log('modal content', this.data);
    let response = [];
    response = this.data.response;
    this.benData = this.data.benData;
    if (response.length > 0) {
      this.information_services = response[0].informations;
      this.counselling_services = response[0].counsellings;
      this.refferal_services = response[0].referrals;
      this.feedback_services = response[0].feedbacks;
    }
    console.log(this.feedback_services, 'FEEDBACK ARRAY');

    if (this.benData.beneficiaryModel != undefined) {
      this.age = this.calculateAge(this.benData.beneficiaryModel.dOB);
    }
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



}
