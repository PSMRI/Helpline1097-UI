import { Component, OnInit, Output, Input, EventEmitter, Directive, ViewChild } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { LocationService } from '../services/common/location.service';
import { CoFeedbackService } from '../services/coService/co_feedback.service';
import { FeedbackTypes } from '../services/common/feedbacktypes.service';
import { dataService } from '../services/dataService/data.service'
import { MdDialog, MdDialogRef } from '@angular/material';
import { FeedbackStatusComponent } from './../feedback-status/feedback-status.component'
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'
// directive
import { Subscription } from 'rxjs/Subscription';
// Common service to pass Data
import { CommunicationService } from './../services/common/communication.service'
import { FeedbackService } from 'app/services/supervisorServices/Feedbackservice.service';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';
declare var jQuery: any;

@Component({
  selector: 'app-co-feedback-services',
  templateUrl: './co-feedback-services.component.html',
  styleUrls: ['./co-feedback-services.component.css']


})
export class CoFeedbackServicesComponent implements OnInit {
  @Input() current_language: any;
  @Input() resetProvideServices: any;
  // currentlanguage: any;

  @Output() feedbackServiceProvided: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('form') form;
  p = 1;
  showFormCondition: boolean = false;
  showTableCondition: boolean = true;
  feedbackServiceID: number = 4;
  selected_state: number = undefined;
  selected_district: number = undefined;
  selected_taluk: number = undefined;
  selected_sdtb: number = undefined;
  selected_institution: number = undefined;
  selected_designation: number = undefined;
  selected_feedbackType: number = undefined;
  selected_severity: number = undefined;
  selected_doi: any = undefined;

  feedbackDescription: any = '';
  beneficiaryRegID: any = this._savedData.beneficiaryRegID;
  userName: any;

  states: any = [];
  districts: any = [];
  taluks: any = [];
  blocks: any = [];
  institutes: any = [];
  designations: any = [];
  feedbackTypes: any = [];
  feedbackSeverities: any = [];
  serviceID: any;
  subServiceID: any;
  count;
  feedbacksArray: any = [];
  data: any = [];
  modalArray: any = [];
  providerServiceMapID: number;
  userID: number;
  filterTerm: any;
  feedbackcounter: any = 1000;
  today: Date;
  maxDate: any;
  minDate: any;
  dec2014: Date;
  subscription: Subscription;
  currentLanguageSet: any;
  constructor(
    private _userBeneficiaryData: UserBeneficiaryData,
    private _locationService: LocationService,
    private _coFeedbackService: CoFeedbackService,
    private _feedbackTypes: FeedbackTypes,
    private _savedData: dataService,
    public dialog: MdDialog,
    private alertMessage: ConfirmationDialogsService,
    private pass_data: CommunicationService,
    private _feedbackListServices: FeedbackService,
    private HttpServices:HttpServices
  ) {
  this.subscription = this.pass_data.getData().subscribe(message => { this.getBenData(message) });
    this._savedData.beneficiary_regID_subject.subscribe(response => {
      this.setBenRegID(response);
    });
  }




  ngOnInit() {
    this.beneficiaryRegID = this._savedData.beneficiaryData.beneficiaryRegID;
    this.userName = this._savedData.uname;
    this.serviceID = this._savedData.current_service.serviceID;
    this.providerServiceMapID = this._savedData.current_service.serviceID;
    this.userID = this._savedData.uid;
    this.GetServiceTypes();
    this._userBeneficiaryData.getUserBeneficaryData(this._savedData.current_service.serviceID)
      .subscribe(response => this.SetUserBeneficiaryFeedbackData(response),
      (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');

      });
    this._coFeedbackService.getDesignations()
      .subscribe(response => this.setDesignation(response),
      (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');
      });
    this._feedbackTypes.getFeedbackTypesData(this.providerServiceMapID)
      .subscribe(response => this.setFeedbackTypes(response),
      (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');
      });
    this._feedbackTypes.getFeedbackSeverityData(this.providerServiceMapID)
      .subscribe(response => this.setFeedbackSeverity(response),
      (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');
      });
    this.count = '0/300';

    this.today = new Date();
    this.maxDate = this.today;
    this.dec2014 = new Date(2014, 11, 1, 0, 0, 0);
    this.GetInstitutes();
    this.assignSelectedLanguage();

  }
  tempFlag: any;

  setBenRegID(data) {
    this.beneficiaryRegID = data.beneficiaryRegID;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.assignSelectedLanguage();
    // this.setLanguage(this.current_language);
    if (this.resetProvideServices) {
      this.tempFlag = true;
      this.showTableCondition = true;
      this.showFormCondition = false;
    }
  }
  showForm() {
    if (this.tempFlag) {
      jQuery('#feedbackForm').trigger("reset");
      this.tempFlag = false;
    }
    this.showFormCondition = true;
    this.showTableCondition = false;
  }

  showTable() {
    this.showFormCondition = false;
    this.showTableCondition = true;
    // this.showBeneficiaryFeedbackList();
    this.filterTerm = "";
		this.searchType = "FeedbackID";
    this.minLength = 1;
    this.maxLength = 30;
    this.filteredFeedbackList= this.data;
  }

  GetServiceTypes() {
    this._feedbackTypes.getTypes(this.providerServiceMapID)
      .subscribe(response => this.setServiceTypes(response),
      (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');
      });
  }
  setServiceTypes(response: any) {
    for (let i: any = 0; i < response.length; i++) {
      if (response[i].subServiceName.toUpperCase().search('FEED') >= 0) {
        this.subServiceID = response[i].subServiceID;
        break;
      }
    }
  }
  // setLanguage(language) {
  //   this.currentlanguage = language;
  //   console.log(language, 'language feedback services mein');
  // }

  showBeneficiaryFeedbackList() {
    this.minDate = this._savedData.beneficiaryData.dOB ? new Date(this._savedData.beneficiaryData.dOB) : this.dec2014;
    this.minDate.setHours(0, 0, 0);
    this._coFeedbackService.getFeedbackHistoryById(this.beneficiaryRegID, this.serviceID)
      .subscribe((response) => {
        if (response) {
          this.setFeedbackHistoryByID(response)
          this.showTable();
        }
        else {
          this.alertMessage.alert("No data found, contact your administrator");
        }
      }, (err) => {
        this.alertMessage.alert('Error in fetching previous feedback, Please try again', 'error');
        console.log('Error in fetching Data of FeedBack' + err);
      });


  }
  SetUserBeneficiaryFeedbackData(regData: any) {
    if (regData.states) {
      this.states = regData.states;
    }
  }

  GetDistricts(state: number) {
    this.districts = [];
    this.taluks = [];
    this.blocks = [];
    this.selected_district=null;
    this.selected_taluk=null;
    // this.institutes = [];
    this._locationService.getDistricts(state)
      .subscribe(response => this.SetDistricts(response),
      (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');
      });
  }
  SetDistricts(response: any) {
    this.districts = response;
  }
  GetTaluks(district: number) {
    this.taluks = [];
    this.blocks = [];
    this.selected_taluk=null;
    // this.institutes = [];
    this._locationService.getTaluks(district)
      .subscribe(response => this.SetTaluks(response),
      (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');
      });
  }
  SetTaluks(response: any) {
    this.taluks = response;
  }
  GetBlocks(taluk: number) {
    this.blocks = [];
    // this.institutes = [];
    this._locationService.getBranches(taluk)
      .subscribe(response => this.SetBlocks(response),
      (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');
      });
  }
  SetBlocks(response: any) {
    this.blocks = response;
  }

  GetInstitutes() {
    this.institutes = [];
    let object = {};
    // let object = { 'providerServiceMapID': this.providerServiceMapID };
    this._locationService.getInstituteList(object)
      .subscribe(response => this.SetInstitutes(response),
      (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');
      });
  }
  SetInstitutes(response: any) {
    this.institutes = response;
  }

  setDesignation(response: any) {
    this.designations = response;
  }
  setFeedbackTypes(response: any) {
    this.feedbackTypes = response;
  }

  setFeedbackSeverity(response: any) {
    this.feedbackSeverities = response;
  }


  generatefeedbackID() {
    return this.feedbackcounter++;
  }

  // submitFeedback ( object: any )
  submitFeedback() {
    let selected_Date;
    if (this.selected_doi) {
      selected_Date = new Date((this.selected_doi) - 1 * (this.selected_doi.getTimezoneOffset() * 60 * 1000)).toJSON();
    }
    const feedbackObj = [{
      'instituteTypeID': this.selected_institution,
      'stateID': this.selected_state,
      'districtID': this.selected_district,
      'blockID': this.selected_taluk,
      'designationID': this.selected_designation,
      'severityID': this.selected_severity,
      'feedbackTypeID': this.selected_feedbackType,
      'feedback': this.feedbackDescription ? this.feedbackDescription.trim() : null,
      'beneficiaryRegID': this.beneficiaryRegID,
      'serviceAvailDate': selected_Date,
      'serviceID': this.serviceID ? this.serviceID : null,
      'subServiceID': this.subServiceID ? this.subServiceID : null,
      'userID': this._savedData.uid,
      'createdBy': this.userName,
      'benCallID': this._savedData.callData.benCallID,
      '1097ServiceID': this.serviceID
    }];
    this._coFeedbackService.createFeedback(feedbackObj)
      .subscribe((response) => {
        this.alertMessage.alert(this.currentLanguageSet.feedbackCreatedSuccessfullyAndFeedbackIDIs + " " + response.requestID, 'success');
        jQuery('#feedbackForm').trigger("reset");
        this.showBeneficiaryFeedbackList();
        this.feedbackServiceProvided.emit();

      }, (err) => {
        this.selected_doi = undefined;
        console.log('Error in Feedback', err);
        this.alertMessage.alert(err.errorMessage, 'error');
      });
  }
  // showtable(response, obj) {
  //   console.log('after registering feedback', response);
  //   var object = {
  //     'feedbackID': '',
  //     'feedback': '',
  //     'severityID': '',
  //     'feedbackTypeID': '',
  //     'createdBy': '',
  //     'feedbackStatusID': ''
  //   };
  //   this.showTable();
  //   // var fdbkID = response.feedBackId;//this.generatefeedbackID();
  //   // object.id = fdbkID;
  //   // object.dor = new Date();
  //   // object.status = 'open';
  //   // object.agentID = "CO0111120";
  //   // console.log( object );
  //   // this.feedbacksArray.push( object );
  //   object.feedbackID = response.feedBackId;
  //   object.feedback = response.feedback;
  //   object.severityID = response.severityID;
  //   object.feedbackTypeID = response.feedbackTypeID;
  //   object.createdBy = response.createdBy;
  //   object.feedbackStatusID = response.feedbackStatusID;
  //   this.feedbacksArray.push(object);

  // }


  modalData(object) {
    this.modalArray.push(object);

    this.modalArray = this.modalArray.map(function (data) {

      return {
        'feedbackRequests': data.feedbackRequests,
        'feedbackResponses': data.feedbackResponses,
        'consolidatedRequests': data.consolidatedRequests,
        'feedbackStatusName': data.feedbackStatus.feedbackStatus
      }
    })

    const dialogRef = this.dialog.open(FeedbackStatusComponent, {
      height: '90%',
      width: '80%',
      disableClose: true,
      data: this.modalArray,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
    this.modalArray = [];
  }

  setFeedbackHistoryByID(response: any) {
    // debugger;
    console.log('the response for feedback history is', response);
    // this.feedbacksArray = response;
    this.data = response;
    this.filteredFeedbackList = response;
  }
  updateCount() {
    this.count = this.feedbackDescription.length + '/300';
  }
  getBenData(benData: any) {
    this.beneficiaryRegID = benData.dataPass.beneficiaryRegID ? benData.dataPass.beneficiaryRegID : this._savedData.beneficiaryRegID;
    this.showBeneficiaryFeedbackList();
  }
  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };
  keyblock(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  minLength: number = 1;
  maxLength: number = 30;
  filteredFeedbackList: any;
  searchType:any = "FeedbackID";
  onSearchChange(type) {
    if (type === 'MobileNumber') {
      this.minLength = 10;
      this.maxLength = 10;
    }
    else {
      this.minLength = 1;
      this.maxLength = 30;
    }
    this.filteredFeedbackList= this.data;
  }

  filterFeedbackList(searchTerm: string) {
    if (!searchTerm)
      this.filteredFeedbackList = this.data;
    else {
      let object = {
        "phoneNum": this.searchType == 'MobileNumber' ? searchTerm : null,
        "requestID": this.searchType == 'FeedbackID' ? searchTerm : null,
        "is1097": true
      };

      console.log(JSON.stringify(object));
      this.filteredFeedbackList = [];
      
      this._feedbackListServices.getFeedback(object).subscribe((res) => {
     // this.feedbackService.getFeedbacklist(object).subscribe((res) => { 
       if(res !== undefined && res !== null) {      
          this.filteredFeedbackList = res;  
       }         
      }, (err) => {
        console.log("error", err.errorMessage)
      });     
    }
  }
  revertFullTable() {
		this.filterTerm = "";
		this.searchType = "FeedbackID";
    this.minLength = 1;
    this.maxLength = 30;
    this.filteredFeedbackList= this.data;
		// this._coFeedbackService.getFeedbackHistoryById(this.benficiaryRegId, this.calledServiceID)
		// 	.subscribe(response => this.setFeedbackHistoryByID(response));
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

