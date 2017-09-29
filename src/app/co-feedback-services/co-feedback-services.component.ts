import { Component, OnInit, Output, Input, EventEmitter, Directive } from '@angular/core';
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
declare var jQuery: any;

@Component({
  selector: 'app-co-feedback-services',
  templateUrl: './co-feedback-services.component.html',
  styleUrls: ['./co-feedback-services.component.css']


})
export class CoFeedbackServicesComponent implements OnInit {
  @Input() current_language: any;
  currentlanguage: any;

  @Output() feedbackServiceProvided: EventEmitter<any> = new EventEmitter<any>();

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
  beneficiaryRegID: any;
  userName: any;

  states: any = [];
  districts: any = [];
  taluks: any = [];
  blocks: any = [];
  institutes: any = [];
  designations: any = [];
  feedbackTypes: any = [];
  feedbackSeverities: any = [];
  serviceID: any = -1;
  subServiceID: any = -1;
  count;
  feedbacksArray: any = [];
  data: any = [];
  modalArray: any = [];
  providerServiceMapID: number;
  userID: number;

  feedbackcounter: any = 1000;
  today: Date;
  maxDate: any;
  subscription: Subscription;
  constructor(
    private _userBeneficiaryData: UserBeneficiaryData,
    private _locationService: LocationService,
    private _coFeedbackService: CoFeedbackService,
    private _feedbackTypes: FeedbackTypes,
    private _savedData: dataService,
    public dialog: MdDialog,
    private alertMessage: ConfirmationDialogsService,
    private pass_data: CommunicationService
  ) { this.subscription = this.pass_data.getData().subscribe(message => { this.getBenData(message) }); }

  showForm() {
    this.showFormCondition = true;
    this.showTableCondition = false;
  }

  showTable() {
    this.showFormCondition = false;
    this.showTableCondition = true;
    // this.showBeneficiaryFeedbackList();
  }

  GetServiceTypes() {
    this._feedbackTypes.getTypes(this.providerServiceMapID)
      .subscribe(response => this.setServiceTypes(response));
  }
  setServiceTypes(response: any) {
    for (let i: any = 0; i < response.length; i++) {
      if (response[i].subServiceName.toUpperCase().search('FEED') >= 0) {
        this.subServiceID = response[i].subServiceID;
        break;
      }
    }
  }

  ngOnInit() {
    this.beneficiaryRegID = this._savedData.beneficiaryData.beneficiaryRegID;
    this.userName = this._savedData.uname;
    this.serviceID = this._savedData.current_service.serviceID;
    this.providerServiceMapID = this._savedData.current_service.serviceID;
    this.userID = this._savedData.uid;
    this.GetServiceTypes();
    this._userBeneficiaryData.getUserBeneficaryData(this._savedData.current_service.serviceID)
      .subscribe(response => this.SetUserBeneficiaryFeedbackData(response));
    this._coFeedbackService.getDesignations()
      .subscribe(response => this.setDesignation(response));
    this._feedbackTypes.getFeedbackTypesData(this.providerServiceMapID)
      .subscribe(response => this.setFeedbackTypes(response));
    this._feedbackTypes.getFeedbackSeverityData(this.providerServiceMapID)
      .subscribe(response => this.setFeedbackSeverity(response));
    this.count = '0/300';

    this.today = new Date();
    this.maxDate = this.today;
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.setLanguage(this.current_language);

  }

  setLanguage(language) {
    this.currentlanguage = language;
    console.log(language, 'language feedback services mein');
  }

  showBeneficiaryFeedbackList() {
    this._coFeedbackService.getFeedbackHistoryById(this.beneficiaryRegID, this.serviceID)
      .subscribe((response) => {
        this.setFeedbackHistoryByID(response)
        this.showTable();
      }, (err) => {
        this.alertMessage.alert('Some Internal Error');
        console.log('Error in fetching Data of FeedBack');
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
    this.institutes = [];
    this._locationService.getDistricts(state)
      .subscribe(response => this.SetDistricts(response));
  }
  SetDistricts(response: any) {
    this.districts = response;
  }
  GetTaluks(district: number) {
    this.taluks = [];
    this.blocks = [];
    this.institutes = [];
    this._locationService.getTaluks(district)
      .subscribe(response => this.SetTaluks(response));
  }
  SetTaluks(response: any) {
    this.taluks = response;
  }
  GetBlocks(taluk: number) {
    this.blocks = [];
    this.institutes = [];
    this._locationService.getBranches(taluk)
      .subscribe(response => this.SetBlocks(response));
  }
  SetBlocks(response: any) {
    this.blocks = response;
  }

  GetInstitutes() {
    this.institutes = [];
    let object = { 'stateID': this.selected_state, 'districtID': this.selected_district, 'districtBranchMappingID': this.selected_sdtb };
    this._locationService.getInstituteList(object)
      .subscribe(response => this.SetInstitutes(response));
  }
  SetInstitutes(response: any) {
    this.institutes = response.institute;
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
    debugger;
    const feedbackObj = [{
      'institutionID': this.selected_institution,
      'designationID': this.selected_designation,
      'severityID': this.selected_severity,
      'feedbackTypeID': this.selected_feedbackType,
      'feedback': this.feedbackDescription,
      'beneficiaryRegID': this.beneficiaryRegID,
      'serviceAvailDate': selected_Date,
      'serviceID': this.serviceID,
      'subServiceID': this.subServiceID,
      'userID': this._savedData.uid,
      'createdBy': this.userName,
      'benCallID': this._savedData.callData.benCallID,
      '1097ServiceID': this.serviceID
    }];
    this._coFeedbackService.createFeedback(feedbackObj)
      .subscribe((response) => {
        this.alertMessage.alert('Successfully Created');
        this.showBeneficiaryFeedbackList();
        this.feedbackServiceProvided.emit();
        jQuery('#feedbackForm').trigger("reset");
      }, (err) => {
        this.selected_doi = undefined;
        console.log('Error in Feedback', err);
        this.alertMessage.alert('Internal Error');
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
        'feedbackResponses': data.feedbackResponses
      }
    })
    const dialogRef = this.dialog.open(FeedbackStatusComponent, {
      height: '90%',
      width: '80%',
      data: this.modalArray,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  setFeedbackHistoryByID(response: any) {
    console.log('the response for feedback history is', response);
    // this.feedbacksArray = response;
    this.data = response;
  }
  updateCount() {
    this.count = this.feedbackDescription.length + '/300';
  }
  getBenData(benData: any) {
    this.beneficiaryRegID = benData.dataPass.beneficiaryRegID;
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
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}

