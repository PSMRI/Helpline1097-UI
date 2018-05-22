import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from '../services/config/config.service';
import { dataService } from '../services/dataService/data.service';
import { QualityAuditService } from '../services/supervisorServices/quality-audit-service.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';

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

  // constants
  userID: any = '';
  providerServiceMapID: any = '';
  serviceProviderID: any = '';
  serviceID: any = '';

  @ViewChild('qaForm') qaForm;


  constructor(
    private configService: ConfigService,
    public sanitizer: DomSanitizer,
    private commonData: dataService,
    private qualityAuditService: QualityAuditService,
    private alertService: ConfirmationDialogsService
  ) { }

  ngOnInit() {
    // let url = this.configService.getTelephonyServerURL() + "adminui.php?voice_logger";
    // console.log("url = " + url);
    // this.qualityAuditURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.userID = this.commonData.Userdata.userID;
    this.serviceProviderID = this.commonData.serviceProviderID;
    this.providerServiceMapID = this.commonData.current_service.serviceID;
    this.getServiceProviderID();
    // this.getServicelines();
    // this.getAgents();
    // this.getCallTypes();
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
      this.callSubTypes = arr;
    }
  }

  getFilteredCallList(formval) {
    console.log('formvalues', formval);
    let obj = {
      'calledServiceID': this.providerServiceMapID,
      'callTypeID': formval.CallSubType,
      'filterStartDate': formval.startDate,
      'filterEndDate': formval.endDate,
      'receivedRoleName': formval.Role
    }
  }

  reset() {
    this.qaForm.resetForm();
  }



}
