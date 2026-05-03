import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { CallServices } from './../services/callservices/callservice.service';
import { dataService } from './../services/dataService/data.service';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { CzentrixServices } from './../services/czentrix/czentrix.service';
import { OutboundReAllocationService } from "../services/outboundServices/outbound-call-reallocation.service";
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';
import {ComplaintDescriptionDialogComponent} from '../complaint-description-dialog/complaint-description-dialog.component';
import { sessionStorageService } from "app/services/sessionStorageService/session-storage.service";

@Component({
  selector: 'app-grievance-outbound-worklist',
  templateUrl: './grievance-outbound-worklist.component.html',
  styleUrls: ['./grievance-outbound-worklist.component.css']
})
export class GrievanceOutboundWorklistComponent implements OnInit {

  @Output() onOutboundCall: EventEmitter<any> = new EventEmitter<any>();
  grievanceOutboundData: any = [];
  filteredSearchResult: any = [];
  currentLanguageSet: any;
  benDetailsList: any;
  constructor(private czentrixServices : CzentrixServices, private outBoundService: CallServices, private outboundReAllocationService: OutboundReAllocationService,
    public alertService: ConfirmationDialogsService, private commonDataService: dataService, public router: Router,
    public dialog: MdDialog, private httpServices:HttpServices, private sessionstorage:sessionStorageService,) {
  }
  
  ngOnInit() {
    this.commonDataService.sendHeaderStatus.next("");
    const serviceProviderMapID = this.commonDataService.current_service.serviceID;
    const userId = this.commonDataService.uid;
    let reqObj = {
      "providerServiceMapID": serviceProviderMapID,
      "userId": userId
    };  
    this.outboundReAllocationService.getGrievanceOutboundCallList(reqObj)
    .subscribe((response) => {
      if(response) {
        this.assignResponse(response);
      }

    }, (err) => { 
      this.alertService.alert(err.errorMessage, 'error');
    });

    this.assignSelectedLanguage();

  }

  assignResponse(outboundHistory: any) {
    this.grievanceOutboundData = outboundHistory;
    this.filteredSearchResult = outboundHistory;
  }

  listBenDetailsOnPhoneNo(data: any) {

    this.commonDataService.outboundBenRegID = data.beneficiaryRegId;

  
    
    this.commonDataService.outboundGrievanceData = data;


          this.czentrixServices.manualDialaNumber("", data.primaryNumber).subscribe((res) => {
            if (res.status.toLowerCase() === 'fail') {
              this.alertService.alert(this.currentLanguageSet.somethingWentWrongInCalling, 'error');
            } else {
              this.commonDataService.callerNumber = data.primaryNumber;

              this.sessionstorage.setItem("isOnCall", "yes");
              this.sessionstorage.setItem("isGrievanceCall", "yes");
            }
          }, (err) => {
            this.alertService.alert(err.errorMessage);
          });
       
  }
  backToDashBoard() {
    this.router.navigate(['/MultiRoleScreenComponent/dashboard']);

  }


  filterComponentList(searchTerm?: string) {
    if (!searchTerm) {
      this.filteredSearchResult = this.grievanceOutboundData;
    } else {
      this.filteredSearchResult = [];
      this.grievanceOutboundData.forEach((item) => {
        for (let key in item) {
          if (key === 'complaintID' || key === 'subjectOfComplaint' || key === 'severety' || key === 'state') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredSearchResult.push(item); break;
            }
          }
        }
      });
    }

  }

  viewComplaintDesc(complaintData:any) {
  
    if(complaintData.complaint !== undefined && complaintData.complaint !== null && complaintData.complaint !== "") {
	    let dialog = this.dialog.open(ComplaintDescriptionDialogComponent, {
	      width: '700px',
	      disableClose: true,
	      data: {
	        type: this.currentLanguageSet.kmDocs,
	        complaintData: complaintData
	      }
	    });
    }
    else {
      this.alertService.alert(this.currentLanguageSet.noComplaintDescriptionFound, 'info');
    }

  }

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
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


  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.httpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
}

