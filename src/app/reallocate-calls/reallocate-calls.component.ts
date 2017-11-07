import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OutboundReAllocationService } from "../services/outboundServices/outbound-call-reallocation.service";
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { CallServices } from '../services/callservices/callservice.service'

@Component({
  selector: 'app-reallocate-calls',
  templateUrl: './reallocate-calls.component.html',
  styleUrls: ['./reallocate-calls.component.css']
})
export class ReallocateCallsComponent implements OnInit {

providerServiceMapID: any;
users = [];
@ViewChild('reallocationForm') reallocationForm: NgForm;
onAgentSelected: boolean =  false;
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

constructor(private OCRService: OutboundReAllocationService,
private getCommonData: dataService, private alertService: ConfirmationDialogsService, private _callServices: CallServices
) { }

ngOnInit() {
  this.providerServiceMapID = this.getCommonData.current_service.serviceID;
  this.getLanguages();
  this.OCRService.getRoles({
    "providerServiceMapID": this.providerServiceMapID
  }).subscribe((response)=>{
    this.roles = response;
    this.roles = this.roles.filter((obj)=>{
    return obj.RoleName.trim().toUpperCase()!="PROVIDERADMIN" && obj.RoleName.trim().toUpperCase()!="SUPERVISOR";
    });
    console.log("roles:", JSON.stringify(this.roles));
  })
}

getAgents(roleID: any, languageObj){
  this.OCRService.getAgents(this.providerServiceMapID,roleID,languageObj.languageName)
  .subscribe((response)=>{
    this.users = response;
    console.log("users: "+ JSON.stringify(this.users));
  })
  this.reallocationForm.form.patchValue( {
    userID: []
  });
}

getLanguages(){
  this._callServices.getLanguages().subscribe(response => {
    this.languages = response;
  }, (err) => {

  });
}

onSubmit(){
  this.onAgentSelected = false;
  this.showFlag = false;
  console.log(this.searchAgent,"searchAgent");
  this.agentName = this.searchAgent.firstName + " " + this.searchAgent.lastName;
  console.log(this.reallocationForm.value);
  this.postData = {
    "providerServiceMapID": this.providerServiceMapID,
    "assignedUserID": this.reallocationForm.value.agentName.userID,
    "preferredLanguageName": this.reallocationForm.value.preferredLanguage.languageName
  };
  if(this.reallocationForm.value.startDate != '' && this.reallocationForm.value.startDate != null){
    this.postData["filterStartDate"] = new Date((this.reallocationForm.value.startDate) - 1 * (this.reallocationForm.value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0,10)+"T00:00:00.000Z";
  }
  if(this.reallocationForm.value.endDate != '' && this.reallocationForm.value.endDate != null){
    this.postData["filterEndDate"] = new Date((this.reallocationForm.value.endDate) - 1 * (this.reallocationForm.value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0,10)+"T23:59:59.999Z";
  }
  console.log(JSON.stringify(this.postData));
  this.onAgentSelected = false;
  this.OCRService.getReallocationCalls(this.postData)
  .subscribe((resProviderData) =>{
          console.log(resProviderData);
          this.totalAgentRecords = resProviderData;
          if(this.totalAgentRecords.length==0){
            this.alertService.alert("No Records available");
          }
          else {
            this.onAgentSelected = true;
          }
  },
  (error)=>{
    console.log(error);
  });
  }

  reallocationDone(){
    this.showFlag = false;
    //refreshing reallocation screen
    this.OCRService.getReallocationCalls(this.postData)
    .subscribe((resProviderData) =>{
            // console.log(resProviderData);
            this.totalAgentRecords = resProviderData;
    },
    (error)=>{
      console.log(error);
    });
  }

  moveToBin(agentName, values, event){
    // console.log("move to bin api followed by refresh logic");
    var tempArray = [];
    for(var i=0; i<values.length;i++){
      tempArray.push(values[i].outboundCallReqID);
    }
    console.log(JSON.stringify(tempArray));
    this.OCRService.moveToBin({
      "outboundCallReqIDs": tempArray
    }).subscribe((response)=>{
      console.log(response);
      // refreshing after moving to bin
      this.reallocationDone();
    },
    (error)=>{
      console.log(error);
    })
  }

  allocateCalls(agentName, values:any, event) {
        this.selectedAgent = {
          "agentName": agentName,
          "roleID": this.search_role,
          "languageName": this.searchLanguage.languageName
        }
        console.log("selectedAgent", this.selectedAgent);
        if(event.target.className=="mat-button-wrapper"){
          for (var i= 0; i< event.target.parentNode.parentNode.parentNode.parentNode.children.length; i++){
              event.target.parentNode.parentNode.parentNode.parentNode.children[i].className="";
          }
          event.target.parentNode.parentNode.parentNode.className = "highlightTrBg";
        }
        else{
          for (var i= 0; i< event.target.parentNode.parentNode.parentNode.children.length; i++){
              event.target.parentNode.parentNode.parentNode.children[i].className="";
          }
          event.target.parentNode.parentNode.className = "highlightTrBg";
        }
        this.showFlag = true;
        this.records = {
          'outboundList': values
        }
  }

}
