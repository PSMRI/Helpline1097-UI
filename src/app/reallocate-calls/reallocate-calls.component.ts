import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OutboundReAllocationService } from "../services/outboundServices/outbound-call-reallocation.service";
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { CallServices } from '../services/callservices/callservice.service'

declare var jQuery: any;

@Component({
  selector: 'app-reallocate-calls',
  templateUrl: './reallocate-calls.component.html',
  styleUrls: ['./reallocate-calls.component.css']
})
export class ReallocateCallsComponent implements OnInit {

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

  constructor(private OCRService: OutboundReAllocationService,
    private getCommonData: dataService, private alertService: ConfirmationDialogsService,
    private _callServices: CallServices
  ) { }

  ngOnInit() {
    this.providerServiceMapID = this.getCommonData.current_service.serviceID;
    this.getLanguages();
    this.OCRService.getRoles({
      "providerServiceMapID": this.providerServiceMapID
    }).subscribe((response) => {
      this.roles = response;
      this.roles = this.roles.filter((obj) => {
        return obj.roleName.trim().toUpperCase() != "PROVIDERADMIN" && obj.roleName.trim().toUpperCase() != "SUPERVISOR";
      });
      console.log("roles:", JSON.stringify(this.roles));
    }),(err) => {
      this.alertService.alert(err.errorMessage,'error');

    }


    // this.startMinDate=new Date();
    // this.startDatee=new Date();

    // this.endMinDate=new Date();
    // this.endMinDate.setDate(this.endMinDate.getDate()+7);
    // this.endDatee=this.endMinDate;

  }

  updateMinValue(d) {

    console.log("date updated", d);
    this.endMinDate.setDate(d.getDate() + 7);

    this.endDatee = new Date(this.endMinDate);

    console.log("end min date", this.endMinDate, "end Date", this.endDatee);


  }

  getAgents(roleID: any) {
    this.OCRService.getAgents(this.providerServiceMapID, roleID)
      .subscribe((response) => {
        this.users = response;
        console.log("users: " + JSON.stringify(this.users));
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
    console.log(this.searchAgent, "searchAgent");
    this.agentName = this.searchAgent.firstName + " " + this.searchAgent.lastName;
    console.log(this.reallocationForm.value, "FORM VALUE");
    this.postData = {
      "providerServiceMapID": this.providerServiceMapID,
      "assignedUserID": this.reallocationForm.value.agentName.userID
      // "preferredLanguageName": this.reallocationForm.value.preferredLanguage.languageName
    };
    if (this.reallocationForm.value.startDate != '' && this.reallocationForm.value.startDate != null) {
      this.postData["filterStartDate"] = new Date((this.reallocationForm.value.startDate) - 1 * (this.reallocationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
    }
    if (this.reallocationForm.value.endDate != '' && this.reallocationForm.value.endDate != null) {
      this.postData["filterEndDate"] = new Date((this.reallocationForm.value.endDate) - 1 * (this.reallocationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z";
    }
    console.log(JSON.stringify(this.postData));
    this.onAgentSelected = false;
    this.OCRService.getReallocationCalls(this.postData)
      .subscribe((resProviderData) => {
        console.log(resProviderData, "in component reallocate-calls, post successful response");
        this.totalAgentRecords = resProviderData;
        if (this.totalAgentRecords.length == 0) {
          this.alertService.alert("No records available.");
        }
        else {
          this.onAgentSelected = true;
        }
      },
      (error) => {
        this.alertService.alert(error.errorMessage,'error');

        console.log(error);
      });
  }

  reallocationDone() {
    this.showFlag = false;
    //refreshing reallocation screen
    this.OCRService.getReallocationCalls(this.postData)
      .subscribe((resProviderData) => {
        // console.log(resProviderData);
        // this.alertService.alert("Moved to Bin Successfully");
        this.totalAgentRecords = resProviderData;
      },
      (error) => {
        this.alertService.alert(error.errorMessage,'error');

        console.log(error);
      });
  }

  moveToBin(language, event) {

    let values = [];

    let reqObj = {
      "providerServiceMapID": this.providerServiceMapID,
      "assignedUserID": this.reallocationForm.value.agentName.userID,
      "preferredLanguageName": language,
      "is1097": true
    }

    if (this.reallocationForm.value.startDate != '' && this.reallocationForm.value.startDate != null) {
      reqObj["filterStartDate"] = new Date((this.reallocationForm.value.startDate) - 1 * (this.reallocationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
    }
    if (this.reallocationForm.value.endDate != '' && this.reallocationForm.value.endDate != null) {
      reqObj["filterEndDate"] = new Date((this.reallocationForm.value.endDate) - 1 * (this.reallocationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z";
    }

    this.OCRService.getOutboundCallList(reqObj).subscribe(response => {
      console.log("OUTBOUND CALL LIST", response);
      values = response;

      // console.log("move to bin api followed by refresh logic");
      var tempArray = [];
      for (var i = 0; i < values.length; i++) {
        tempArray.push(values[i].outboundCallReqID);
      }
      console.log(JSON.stringify(tempArray));
      this.OCRService.moveToBin({
        "outboundCallReqIDs": tempArray
      }).subscribe((response) => {
        console.log(response);
        this.alertService.alert("Moved to bin successfully",'success');
        // refreshing after moving to bin
        this.reallocationDone();
      },
        (error) => {
          this.alertService.alert(error.errorMessage,'error');
          console.log(error);
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
      "providerServiceMapID": this.providerServiceMapID,
      "assignedUserID": this.reallocationForm.value.agentName.userID,
      "preferredLanguageName": language,
      "is1097": true
    }

    if (this.reallocationForm.value.startDate != '' && this.reallocationForm.value.startDate != null) {
      reqObj["filterStartDate"] = new Date((this.reallocationForm.value.startDate) - 1 * (this.reallocationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
    }
    if (this.reallocationForm.value.endDate != '' && this.reallocationForm.value.endDate != null) {
      reqObj["filterEndDate"] = new Date((this.reallocationForm.value.endDate) - 1 * (this.reallocationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z";
    }

    this.OCRService.getOutboundCallList(reqObj).subscribe(response => this.success(response),
  (err)=> {
    this.alertService.alert(err.errorMessage,'error');
  });
    this.records = {
      'outboundList': this.a
    }

    this.records['langaugeName'] = { "langName": language };
    this.records['assignedUserID'] = this.reallocationForm.value.agentName.userID;


    console.log("selectedAgent", this.selectedAgent);
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

}
