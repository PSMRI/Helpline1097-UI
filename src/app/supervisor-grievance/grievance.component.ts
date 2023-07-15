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


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { FeedbackService } from '../services/supervisorServices/Feedbackservice.service';
import { dataService } from '../services/dataService/data.service';
import { MdMenuTrigger, MdDatepicker } from '@angular/material';
import { CustomValidators } from 'ng2-validation';
import { MessageBag, ValidationMessagesService } from 'ng2-custom-validation';
import { CoFeedbackService } from '../services/coService/co_feedback.service';
import { AlernateEmailModelComponent } from './../alernate-email-model/alernate-email-model.component'
import { MdDialog } from '@angular/material';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { FeedbackTypes } from '../services/common/feedbacktypes.service';
import { request } from 'd3';
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'supervisor-grievance',
  templateUrl: './grievance.component.html',
  styleUrls: ['./grievance.component.css'],
  providers: [FeedbackService]
})
export class grievanceComponent implements OnInit {

  file: any;
  fileContent: any;

  valid_file_extensions = ['msg', 'pdf', 'doc', 'docx', 'txt'];
  invalid_file_flag = false;

  public showupdateFeedback = true;
  public showupdateFeedback1 = true;
  public action = "view";
  public showUser = true;
  feedbackList: any;
  feedbackresponceList: any;
  data: any;// it is am using for edit purpose;
  data1: any;
  serviceID: any;
  myDatepicker = '';
  myDatepicker1 = '';
  feedbackStatuses: any;
  emailStatuses: any;
  public showfeedbackstatus = 1
  public feedBackRequestsResponse: any;
  public feedBackResponses: any;
  public isCollapsedResponse = false;
  public beneficiaryID = undefined;
  totalRecord;
  lastFeedbackStatus: any;
  public feedbackStatusData: any;
  error: any = { isError: false, errorMessage: '' };
  today: any;
  maxStartDate: any;
  maxEndDate: any;
  providerServiceMapID: any;
  current_agent: any;
  userId: any;
  distictID: any;
  tableView= false;
  currentLanguageSet: any;
  fileList: FileList;
  error1: boolean = false;
  error2: boolean = false;
  invalidFileNameFlag:boolean = false;
  maxFileSize = 5;
  constructor(
    private _feedbackservice: FeedbackService,
    private _saved_data: dataService,
    private _coFeedbackService: CoFeedbackService,
    private dialog: MdDialog,
    private alertMessage: ConfirmationDialogsService,
    private feedbackService: FeedbackTypes,
    public httpServices:HttpServices
  ) {
    this.feedbackList;
    this.feedbackresponceList;

    /*
      editor:Diamond Khanna
      date:16 Aug,2017
    */
    this.feedBackRequestsResponse = [];
    this.feedBackResponses = [];

    /*
     end
   */
  }



  feedbackForm = new FormGroup({
    feedbackID: new FormControl(),
    feedbackSupSummary: new FormControl(),
    beneficiaryName: new FormControl(),
    comments: new FormControl(),
    createdBy: new FormControl(),
    createdDate: new FormControl(),
    supUserID: new FormControl(),
    feedbackDate: new FormControl(),
    feedbackTypeName: new FormControl(),
    feedbackStatus: new FormControl(),
    emailStatus: new FormControl(),
    institutionName: new FormControl(),
    designationName: new FormControl(),
    severityTypeName: new FormControl(),
    //feedbackAgainst: new FormControl(),
    // natureOfComplaint: new FormControl(),
    // serviceName: new FormControl(),
    // userName: new FormControl(),
    // smsPhoneNo: new FormControl(),
    modifiedBy: new FormControl(),
    updateResponse: new FormControl(),
    emailStatusID: new FormControl(),
    feedbackStatusID: new FormControl(),
    feedbackRequestID: new FormControl()
  });

  feedbackForm1 = new FormGroup({

    feedbackID: new FormControl(),
    feedbackSupSummary: new FormControl(),
    beneficiaryName: new FormControl(),
    comments: new FormControl(),
    createdBy: new FormControl(),
    createdDate: new FormControl(),
    supUserID: new FormControl("1"),
    startDate: new FormControl(),
    complaintId: new FormControl(),
    endDate: new FormControl()


  });


  feedbackForm3 = new FormGroup({
    feedbackID: new FormControl()

  })


  feedbackForm2 = new FormGroup({

    requestID: new FormControl('',),

    startDate: new FormControl('', CustomValidators.date),
    endDate: new FormControl('', CustomValidators.minDate('2016-09-09')),
    feedbackTypeID: new FormControl('')
  });

  feedbackTypes: any = [];

  ngOnInit() {
    this.assignSelectedLanguage();
    let start = new Date();
    start.setDate(start.getDate()-7);
    start.setHours(0, 0, 0, 0);
    this.feedbackForm2.controls.startDate.setValue(start);
    let end = new Date();
    end.setDate(end.getDate());
    end.setHours(23, 59, 59, 0);
    this.feedbackForm2.controls.endDate.setValue(end);


    this.serviceID = this._saved_data.current_service.serviceID;
    let requestData = {};
    requestData['serviceID'] = this.serviceID;
    requestData['is1097'] = true;

    let eDate = new Date();
    start.setDate(start.getDate());
    eDate.setHours(23, 59, 59, 0);
    eDate = this.updateTimeOffset(eDate);
    requestData['endDate'] = eDate;

    let sDate = new Date()
    sDate.setDate(sDate.getDate()-7);
    sDate.setHours(0, 0, 0, 0);
    sDate = this.updateTimeOffset(sDate);
    requestData['startDate'] = sDate;
    
    this.feedbackService.getFeedbackTypeID(this.serviceID)
      .subscribe((response) => {
        console.log(response, "FeedBack Types response");
        this.feedbackTypes = response;
      },
        (error) => {
          console.log(error);
        });

    this._feedbackservice.getFeedbackStatuses().subscribe(resProviderData => this.feedbackStatuses = resProviderData);

    this._feedbackservice.getEmailStatuses().subscribe(resProviderData => this.emailStatuses = resProviderData);

    // this._feedbackservice.getFeedback(requestData)
    //   .subscribe(resProviderData => this.providers(resProviderData));
    this.onSearch();

    this.today = new Date();
    this.providerServiceMapID = this._saved_data.current_service.serviceID;
    this.current_agent = this._saved_data.uname;
    this.userId = this._saved_data.uid;

    this.maxStartDate = new Date();
    this.maxStartDate.setDate(this.today.getDate());
    this.maxStartDate.setHours(0, 0, 0, 0);

    this.maxEndDate = new Date();
    this.maxEndDate.setDate(this.today.getDate());
    this.maxEndDate.setHours(23, 59, 59, 0);

  }


  ngDoCheck() {
    this.assignSelectedLanguage();
    }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
    
  onSubmit() {
    // this.saveNSendEmail(this.feedbackForm.value.feedbackSupSummary)
    // this.action = "view";

    let bodyString = this.feedbackForm.value;
    bodyString['serviceID'] = this.serviceID;
    bodyString['feedbackStatus'] = undefined;
    bodyString['emailStatus'] = undefined;
    bodyString['feedbackID'] = this.feedbackID_whilesaving;
    // bodyString[ "" ] = undefined;
    console.log('SPData' + JSON.stringify(bodyString));
    // bodyString.feedbackStatus = undefined;
    // bodyString.emailStatus = undefined;

    if (this.action == 'edit') {
      this._feedbackservice.requestFeedback(bodyString)
        .subscribe(resfeedbackData => {
          // this.alertMessage.alert('Successfully edited', 'success');
          let dialog = this.dialog.open(AlernateEmailModelComponent, {
            disableClose: true,
            width: '500px',
            data: {
              'feedbackID' : this.feedbackID_whilesaving,
              'districtID' :this.distictID
            }
          })
          dialog.afterClosed()
            .subscribe((response) => {
              this.showUsers(resfeedbackData);
            });
        },
          (error) => {
            this.alertMessage.alert(error.errorMessage, 'error');
          });
    }
    // if(this.action == 'edit')
    // this._feedbackservice.updateFeedback( bodyString )
    //   .subscribe( resfeedbackData => this.showUsers( resfeedbackData ) )

    if (this.action == 'update') {
      let kmFileManager = undefined;
      if (this.file != undefined) {
        kmFileManager = {
          "fileName": (this.file != undefined) ? this.file.name : '',
          "fileExtension": (this.file != undefined) ? '.' + this.file.name.split('.')[1] : '',
          "providerServiceMapID": this.providerServiceMapID,
          "userID": this.userId,
          "fileContent": (this.fileContent != undefined) ? this.fileContent.split(',')[1] : '',
          "createdBy": this.current_agent
        }

      }
      bodyString['kmFileManager'] = kmFileManager;
      bodyString['feedbackResponseID'] = undefined;

      this._feedbackservice.updateResponce(bodyString)
        .subscribe((resfeedbackData) => {
          this.alertMessage.alert(this.currentLanguageSet.successfullyUpdated, 'success');
          this.error1 = false;
          this.error2 = false;
          this.invalid_file_flag = false;
          this.file = undefined;
          this.showUsers(resfeedbackData)
        }, (err) => {
          this.alertMessage.alert(err.errorMessage, 'error');
        })
    }

  }

  showUsers(data) {
    this.action = 'view';
    this.onSearch();
  }

  back() {
    this.action = "view";
  }

  providers(data) {
    this.feedbackList = data;
    this.showUser = true;
    this.showupdateFeedback = true;
    this.showupdateFeedback1 = true;
    console.log(data);
  }

  showUser1(data1) {

  }



  requestFeedback(feedback) {
    console.log(JSON.stringify(feedback, null, 4), "****edit_FEEDBACK****");
    this.feedbackForm.reset();
    // this.showupdateFeedback=!this.showupdateFeedback;
    this.action = 'edit';


    this.feedbackID_whilesaving = feedback.feedbackID;
    // use request ID in place of feedbackID while displaying, but while saving/updating use feedbackID
    this.feedbackForm.controls.feedbackID.setValue(feedback.requestID);
    this.feedbackForm.controls.feedbackSupSummary.setValue(
      (feedback.feedbackRequests.length > 0 && feedback.feedbackRequests && feedback.feedbackRequests[feedback.feedbackRequests.length - 1].feedbackSupSummary) ?
        feedback.feedbackRequests[feedback.feedbackRequests.length - 1].feedbackSupSummary : feedback.feedback
    );
    // this.feedbackForm.controls.feedbackSupSummary.setValue(feedback.feedback);
    this.feedbackForm.controls.beneficiaryName.setValue(feedback.mUser.firstName + " " + (feedback.mUser.lastName ? feedback.mUser.lastName : ""));
    // this.feedbackForm.controls.createdDate.setValue(feedback.CreatedDate);
    this.feedbackForm.controls.feedbackDate.setValue(new Date(feedback.createdDate).toLocaleDateString('en-in'));
    this.feedbackForm.controls.feedbackTypeName.setValue(feedback.feedbackType.feedbackTypeName);
    this.feedbackForm.controls.feedbackStatus.setValue(feedback.feedbackStatus ? feedback.feedbackStatus.feedbackStatus : "");
    this.feedbackForm.controls.emailStatus.setValue(feedback.emailStatus.emailStatus);
    this.feedbackForm.controls.feedbackStatusID.setValue(feedback.feedbackStatusID);
    this.lastFeedbackStatus = feedback.feedbackStatus ? feedback.feedbackStatus.feedbackStatus : undefined;
    this.feedbackForm.controls.emailStatusID.setValue(feedback.emailStatusID);
    if (feedback.instituteType) {
      this.feedbackForm.controls.institutionName.setValue(feedback.instituteType.institutionType);
    }
    this.feedbackForm.controls.designationName.setValue(feedback.designation ? feedback.designation.designationName : "");
    this.feedbackForm.controls.severityTypeName.setValue(feedback.severity ? feedback.severity.severityTypeName : "");
    //this.feedbackForm.controls.feedbackAgainst.setValue(feedback.feedbackAgainst ? feedback.feedbackAgainst : "");
    // this.feedbackForm.controls.natureOfComplaint.setValue(feedback.feedbackNatureDetail ? feedback.feedbackNatureDetail.feedbackNature : "");
    // this.feedbackForm.controls.serviceName.setValue(feedback.serviceName);
    // this.feedbackForm.controls.userName.setValue(feedback.userName);
    // this.feedbackForm.controls.smsPhoneNo.setValue(feedback.smsPhoneNo);
    let requestCreatedBy = (feedback.consolidatedRequests ? (
      feedback.consolidatedRequests[0] ? feedback.consolidatedRequests[0].createdBy : undefined) : undefined);
    let responseCreatedBy = (feedback.consolidatedRequests ? (
      feedback.consolidatedRequests[0] ? feedback.consolidatedRequests[0].responseUpdatedBy : undefined) : undefined);
    if (!responseCreatedBy) {
      responseCreatedBy = requestCreatedBy;
    }
    this.feedbackForm.controls.modifiedBy.setValue(this._saved_data.uname);
    this.feedbackForm.controls.createdBy.setValue(feedback.createdBy)
    //  this.feedbackForm.controls.feedbackID.setValue(feedback.FeedbackID);

    // feedback request response

    /*
     editor:Diamond Khanna
     date:16 Aug,2017
   */

    // this._coFeedbackService.getFeedbackHistoryById(this.mUserID, this.serviceID)
    //   .subscribe((response) => {
    //     this.setFeedbackHistoryByID(response)
    //   }, (err) => {
    //     console.log('Error in fetching Data of FeedBack');
    //   });

    this.feedBackRequestsResponse = feedback.consolidatedRequests;
    this.feedBackResponses = feedback.feedbackResponses;

    /*
     end
   */

    this.isCollapsedResponse = true;
    this.distictID = feedback.district.districtID
    this.tableView=false;
  }

  feedbackID_whilesaving: any;
  updateResponse(feedback) {
    console.log(feedback, "****update_FEEDBACK****");

    this.feedbackForm.reset();
    // this.showupdateFeedback=!this.showupdateFeedback;
    this.action = 'update';

    console.log(JSON.stringify(feedback));
    this.feedbackID_whilesaving = feedback.feedbackID;
    // use request ID in place of feedbackID while displaying, but while saving/updating use feedbackID
    this.feedbackForm.controls.feedbackID.setValue(feedback.feedbackID);
    this.feedbackForm.controls.feedbackSupSummary.setValue(
      (feedback.feedbackRequests.length > 0 && feedback.feedbackRequests && feedback.feedbackRequests[0].feedbackSupSummary) ?
        feedback.feedbackRequests[0].feedbackSupSummary : feedback.feedback
    );
    this.feedbackForm.controls.feedbackRequestID.setValue(
      (feedback.feedbackRequests && feedback.feedbackRequests.length > 0 && feedback.feedbackRequests[0].feedbackRequestID) ?
        feedback.feedbackRequests[0].feedbackRequestID : undefined
    );
    this.feedbackForm.controls.beneficiaryName.setValue(feedback.beneficiary.firstName + " " + (feedback.beneficiary.lastName ? feedback.beneficiary.lastName : ""));
    // this.feedbackForm.controls.createdDate.setValue(feedback.CreatedDate);
    this.feedbackForm.controls.feedbackDate.setValue(new Date(feedback.createdDate).toLocaleDateString('en-in'));
    this.feedbackForm.controls.feedbackTypeName.setValue(feedback.feedbackType.feedbackTypeName);
    this.feedbackForm.controls.feedbackStatus.setValue(feedback.feedbackStatus ? feedback.feedbackStatus.feedbackStatus : "");
    this.feedbackForm.controls.emailStatus.setValue(feedback.emailStatus.emailStatus);
    this.feedbackForm.controls.feedbackStatusID.setValue(feedback.feedbackStatusID);
    this.feedbackForm.controls.emailStatusID.setValue(feedback.emailStatusID);
    if (feedback.instituteType) {
      this.feedbackForm.controls.institutionName.setValue(feedback.instituteType.institutionType);
    }
    this.feedbackForm.controls.designationName.setValue(feedback.designation ? feedback.designation.designationName : "");
    this.feedbackForm.controls.severityTypeName.setValue(feedback.severity ? feedback.severity.severityTypeName : "");
    this.lastFeedbackStatus = feedback.feedbackStatus ? feedback.feedbackStatus.feedbackStatus : undefined;
    //this.feedbackForm.controls.feedbackAgainst.setValue(feedback.feedbackAgainst ? feedback.feedbackAgainst : "");
    // this.feedbackForm.controls.natureOfComplaint.setValue(feedback.feedbackNatureDetail ? feedback.feedbackNatureDetail.feedbackNature : "");

    // this.feedbackForm.controls.serviceName.setValue(feedback.serviceName);
    // this.feedbackForm.controls.userName.setValue(feedback.userName);
    // this.feedbackForm.controls.smsPhoneNo.setValue(feedback.smsPhoneNo);
    // this.feedbackForm.controls.modifiedBy.setValue(feedback.modifiedBy);
    let requestCreatedBy = (feedback.consolidatedRequests ? (
      feedback.consolidatedRequests[0] ? feedback.consolidatedRequests[0].createdBy : undefined) : undefined);
    let responseCreatedBy = (feedback.consolidatedRequests ? (
      feedback.consolidatedRequests[0] ? feedback.consolidatedRequests[0].responseUpdatedBy : undefined) : undefined);
    if (!responseCreatedBy) {
      responseCreatedBy = requestCreatedBy;
    }
    this.feedbackForm.controls.modifiedBy.setValue(this._saved_data.uname);
    this.feedbackForm.controls.createdBy.setValue(feedback.createdBy)
    //  this.feedbackForm.controls.feedbackID.setValue(feedback.FeedbackID);

    // feedback request response

    /*
     editor:Diamond Khanna
     date:16 Aug,2017
   */

    // this._coFeedbackService.getFeedbackHistoryById(this.beneficiaryID, this.serviceID)
    //   .subscribe((response) => {
    //     this.setFeedbackHistoryByID(response)
    //   }, (err) => {
    //     console.log('Error in fetching Data of FeedBack');
    //   });

    this.feedBackRequestsResponse = feedback.consolidatedRequests;
    this.feedBackResponses = feedback.feedbackResponses;
    this.tableView=false;
    /*
      end
    */

  }


  onSend(feedback) {
    console.log(feedback);
    console.log('SPData' + JSON.stringify(feedback));
    let dataforUpdate = feedback;
    dataforUpdate['serviceID'] = this.serviceID;

    this.feedbackForm1.controls.feedbackID.setValue(feedback.feedbackID);
    this.feedbackForm1.controls.feedbackSupSummary.setValue(feedback.feedback);
    this.feedbackForm1.controls.beneficiaryName.setValue(feedback.beneficiary.firstName + " " + (feedback.beneficiary.lastName ? feedback.beneficiary.lastName : ""));
    // this.feedbackForm1.controls.createdBy.setValue(feedback.createdBy);
    let requestCreatedBy = (feedback.feedbackRequests ? (feedback.feedbackRequests[0] ? feedback.feedbackRequests[0].createdBy : undefined) : undefined);
    let responseCreatedBy = (feedback.feedbackResponses ? (feedback.feedbackResponses[0] ? feedback.feedbackResponses[0].createdBy : undefined) : undefined);
    if (responseCreatedBy) {
      responseCreatedBy = (feedback.feedbackResponses[0].feedbackRequestID === feedback.feedbackRequests[0].feedbackRequestID) ? responseCreatedBy : requestCreatedBy;
    }
    this.feedbackForm.controls.modifiedBy.setValue((responseCreatedBy ? responseCreatedBy : feedback.createdBy));

    this.feedbackForm.controls.createdBy.setValue(feedback.createdBy)
    this.feedbackForm1.controls.createdDate.setValue(feedback.createdDate);

    console.log('raj' + dataforUpdate)
    let bodyString = this.feedbackForm1.value;
    this._feedbackservice.requestFeedback(bodyString)
      .subscribe(resfeedbackData => this.showUsers(resfeedbackData))
    // this._feedbackservice.updateStatus( bodyString )
    //   .subscribe( resfeedbackData => this.showUsers( resfeedbackData ) )


  }
  showForm() {
    this.showUser = !this.showUser;

  }
  updateTimeOffset(date: any) {
    //(this.DOB) - 1 * (this.DOB.getTimezoneOffset() * 60 * 1000)
    date = new Date(date.valueOf() - 1 * date.getTimezoneOffset() * 60 * 1000);
    return date;
  }
  onSearch() {
    let bodyString = this.feedbackForm2.value;
    if (bodyString.endDate === '') {
      bodyString.endDate = undefined;
    }
    else {
      bodyString.endDate.setHours(23, 59, 59, 0);
      bodyString.endDate = this.updateTimeOffset(bodyString.endDate);
    }

    if (bodyString.startDate === '') {
      bodyString.startDate = undefined;
    }
    else {
      bodyString.startDate.setHours(0, 0, 0, 0);

      bodyString.startDate = this.updateTimeOffset(bodyString.startDate);
    }

    if (bodyString.requestID === '') {
      bodyString.requestID = undefined;
    }
    if (bodyString.feedbackTypeID === '') {
      bodyString.feedbackTypeID = undefined;
    }
    bodyString['serviceID'] = this.serviceID;
    bodyString['is1097'] = true;
    // this._feedbackservice.searchFeedback( bodyString )
    //   .subscribe( resProviderData => this.providers( resProviderData ) );
    this._feedbackservice.getFeedback(bodyString)
      .subscribe((resProviderData) => {
        this.providers(resProviderData)
        this.tableView=true;
      },
        (err) => {
          this.alertMessage.alert(err.status, 'error');
          this.tableView=false;
        });
        
  }

  onClick(feedback) {
    this.action = 'Click';
    this.feedbackForm3.controls.feedbackID.setValue(feedback.FeedBackID);
    let bodyString = this.feedbackForm3.value;
    // this._feedbackservice.responce( bodyString )
    //   .subscribe( resProviderData => this.showResponce( resProviderData ) );
    this._feedbackservice.updateResponce(bodyString)
      .subscribe(resProviderData => this.showResponce(resProviderData));

  }
  showResponce(data1) {
    this.feedbackresponceList = data1;
    console.log(this.feedbackresponceList)
    console.log('SPData' + JSON.stringify(data1));


  }

  compareTwoDates() {
    if (new Date(this.feedbackForm2.controls['endDate'].value) < new Date(this.feedbackForm2.controls[' startDate'].value)) {
      this.error = { isError: true, errorMessage: 'End Date can not before start date' };
    }
  }
  showResponse(data: any) {
    console.log('Corresponding data is', data.target);
    this.isCollapsedResponse = !this.isCollapsedResponse;
    // this.renderer.setElementAttribute(this.trChild.nativeElement, 'collapse', 'isCollapsedResponse');
  }

  setFeedbackHistoryByID(response: any) {
    console.log('the response for feedback history is', response);
    this.feedbackStatusData = response;
    if (response) {
      console.log('Feed back data is', this.feedbackStatusData);
      this.feedBackRequestsResponse = this.feedbackStatusData.feedbackRequests;
      console.log('Feed back request data', this.feedBackRequestsResponse);
      this.feedBackResponses = this.feedbackStatusData.feedbackResponses;
      console.log('feed back response data', this.feedBackResponses);
      this.totalRecord = this.feedBackRequestsResponse.length;
    } else {
      console.log('No data Available')
    }
  }

  saveNSendEmail(feedback) {
    let dialogReff = this.dialog.open(AlernateEmailModelComponent, {
      // height: '350px',
      width: '620px',
      disableClose: false,
      data: feedback
    });
  }

  // file change event
  onFileUpload($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): any {
    this.file = undefined;
    console.log('mcnmxcn', inputValue);
    this.fileList =inputValue.files;
    if (this.fileList.length == 0) {
      this.error1 = true;
      this.error2 = false;
      this.invalid_file_flag = false;
      this.invalidFileNameFlag=false;
    }
    else {
    this.file = inputValue.files[0];
    if (this.file) {

      let fileNameExtension = this.file.name.split(".");
      let fileName = fileNameExtension[0];
      if(fileName !== undefined && fileName !== null && fileName !== "")
      {
       this.invalidFileNameFlag = false;
      var isvalid = this.checkExtension(this.file);
      console.log(isvalid, 'VALID OR NOT');
      if (isvalid) {

        if ((this.fileList[0].size / 1000 / 1000) > this.maxFileSize) {
          console.log("File Size" + this.fileList[0].size / 1000 / 1000);
          this.error2 = true;
          this.error1 = false;
          this.invalid_file_flag = false;
          this.invalidFileNameFlag=false;
        }
        else {
          this.error1 = false;
          this.error2 = false;
          this.invalid_file_flag = false;
          this.invalidFileNameFlag=false;
        // this.knowledgeForm.controls['fileInput'].setValue(this.file.name);  //commented as no form here; WIP for Future email integration
        const myReader: FileReader = new FileReader();
        // binding event to access the local variable
        myReader.onloadend = this.onLoadFileCallback.bind(this)
        myReader.readAsDataURL(this.file);
        this.invalid_file_flag = false;
        }
      }
      else {
        this.invalid_file_flag = true;
        this.error1 = false;
        this.error2 = false;
        this.invalidFileNameFlag=false;
      }

    }
    else{
     this.invalidFileNameFlag=true;
     this.error1 = false;
     this.error2 = false;
     this.invalid_file_flag = false;
    // this.alertMessage.alert(this.currentLanguageSet.invalidFileName, 'error');
    }

    } else {
      // this.knowledgeForm.controls['fileInput'].setValue('');  //commented as no form here; WIP for Future email integration
      this.invalid_file_flag = false;
    }
  }

  }
  onLoadFileCallback = (event) => {
    this.fileContent = event.currentTarget.result;

  }
  checkExtension(file) {
    var count = 0;
    console.log('FILE DETAILS', file);
    var array_after_split = file.name.split('.');
    if(array_after_split.length == 2) {
    var file_extension = array_after_split[array_after_split.length - 1];
    for (let i = 0; i < this.valid_file_extensions.length; i++) {
      if (file_extension.toUpperCase() === this.valid_file_extensions[i].toUpperCase()) {
        count = count + 1;
      }
    }
    if (count > 0) {
      return true;
    } else {
      return false;
    }
  } else
    {
      return false;
    }
  }

  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };

  backToFeedbackTracking(){
    this.action = 'view';
    this.tableView = true;
    this.error1 = false;
    this.error2 = false;
    this.invalid_file_flag = false;
    this.invalidFileNameFlag=false;
    this.file = undefined;
    
  }
}