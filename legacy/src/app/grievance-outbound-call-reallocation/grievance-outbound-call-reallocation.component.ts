
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OutboundReAllocationService } from "../services/outboundServices/outbound-call-reallocation.service";
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { CallServices } from '../services/callservices/callservice.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

declare var jQuery: any;

@Component({
  selector: 'app-grievance-outbound-call-reallocation',
  templateUrl: './grievance-outbound-call-reallocation.component.html',
  styleUrls: ['./grievance-outbound-call-reallocation.component.css']
})
export class GrievanceOutboundCallReallocationComponent implements OnInit {

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
  searchRole: any;
  agentName: any;
  languages = [];
  outboundListData: any = [];
  currentLanguageSet: any;

  constructor(private outboundReAllocationService: OutboundReAllocationService,
    private getCommonData: dataService, private alertService: ConfirmationDialogsService,
    private callServices: CallServices,public httpServices: HttpServices
  ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.getCommonData.current_service.serviceID;
    this.getLanguages();
    this.getRoleDetails();

  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  getRoleDetails() {
    this.outboundReAllocationService.getRoles({
      "providerServiceMapID": this.providerServiceMapID
    }).subscribe((response) => {
      this.roles = response;
      this.roles = this.roles.filter((obj) => {
        if(obj !== undefined && obj !== null && obj.roleName !== undefined && obj.roleName !== null)
        return obj.roleName.trim().toUpperCase() !== "PROVIDERADMIN" && obj.roleName.trim().toUpperCase() !== "SUPERVISOR";
      });
    },(err) => {
      this.alertService.alert(err.errorMessage,'error');

    });
  }

  getAgents(roleID: any) {
    this.outboundReAllocationService.getAgents(this.providerServiceMapID, roleID)
      .subscribe((response) => {
        this.users = response;
      },(err) => {
        this.alertService.alert(err.errorMessage,'error');
      });
    this.reallocationForm.form.patchValue({
      userID: []
    });
  }

  getLanguages() {
    this.callServices.getLanguages().subscribe(response => {
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
      "providerServiceMapID": this.providerServiceMapID,
      "userID": this.reallocationForm.value.agentName.userID
    };
 
    this.onAgentSelected = false;
    this.outboundReAllocationService.getGrievanceReallocationCalls(this.postData)
      .subscribe((resProviderData) => {
        this.totalAgentRecords = resProviderData;
        if (this.totalAgentRecords.length === 0) {
          this.alertService.alert(this.currentLanguageSet.noRecordsAvailable);
        }
        else {
          this.onAgentSelected = true;
        }
      },
      (error) => {
        this.alertService.alert(error.errorMessage,'error');
      });
  }

  reallocationDone() {
    this.showFlag = false;
    this.outboundReAllocationService.getGrievanceReallocationCalls(this.postData)
      .subscribe((resProviderData) => {
        this.totalAgentRecords = resProviderData;
        if (this.totalAgentRecords && this.totalAgentRecords.length === 0) {
          this.onAgentSelected = false;
    }
      },
      (error) => {
        this.alertService.alert(error.errorMessage,'error');
      });
  }

  moveToBin(language, noOfRecords) {

    let values = [];

    let reqObj = {
      "providerServiceMapID": this.providerServiceMapID,
      "userID": this.reallocationForm.value.agentName.userID,
      "preferredLanguageName": language,
      "is1097": true,
      "noOfCalls": noOfRecords
    }
      this.outboundReAllocationService.grievanceMoveToBin(reqObj).subscribe((response) => {
        if(response) {
        this.alertService.alert(this.currentLanguageSet.movedToBinSuccessfully,'success');

        this.reallocationDone();
        }
      },
        (error) => {
          this.alertService.alert(error.errorMessage,'error');
        })

  }

  allocateCalls(language: any, noOfRecords: any) {

    this.selectedAgent = {
      "agentName": this.agentName,
      "roleID": this.searchRole,
      "languageName": language,
      "assignedUserID": this.reallocationForm.value.agentName.userID
    }

    const outboundObj = {};
    outboundObj['assignedUserID'] = this.reallocationForm.value.agentName.userID;
    outboundObj['langaugeName'] = { langName: language };
    outboundObj['noOfRecords'] = noOfRecords;
    outboundObj['isAllocate'] = false;
    this.records = outboundObj;
    this.showFlag = true;


  }

}
