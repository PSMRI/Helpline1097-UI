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
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'

@Component({
  selector: 'supervisor-grievance',
  templateUrl: './grievance.component.html',
  styleUrls: ['./grievance.component.css'],
  providers: [FeedbackService]
})
export class supervisorFeedback implements OnInit {

  providerServiceMapID:any;
  userId:any;
  current_agent:any;

  public showupdateFeedback = true;
  public showupdateFeedback1 = true;
  public action = "view";
  public showUser = true;
  feedbackList: any = [];
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
  consolidatedRequests: any;
  feedbackStatusName: any;
  totalRecord;
  maxDate: Date;
  editFeedBack: boolean = false;
  feedBackDiv: boolean = true;
  public feedbackStatusData: any;
  dateIncident: any = undefined;
  error: any = { isError: false, errorMessage: '' };

  constructor(
              private _feedbackservice: FeedbackService,
              private _saved_data: dataService,
              private _coFeedbackService: CoFeedbackService,
              private dialog: MdDialog,
              private alertMessage: ConfirmationDialogsService
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
    feedbackStatusName: new FormControl(),
    emailStatusName: new FormControl(),
    institutionName: new FormControl(),
    designationName: new FormControl(),
    severityTypeName: new FormControl(),
    serviceName: new FormControl(),
    userName: new FormControl(),
    smsPhoneNo: new FormControl(),
    modifiedBy: new FormControl(),
    incidentDate: new FormControl(),
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

    feedbackID: new FormControl('', CustomValidators.number),

    startDate: new FormControl('', CustomValidators.date),
    endDate: new FormControl('', CustomValidators.minDate('2016-09-09'))
  });





   ngOnInit() {
    this.serviceID = this._saved_data.current_service.serviceID;
    let requestData = {};
    requestData['serviceID'] = this.serviceID;

    this._feedbackservice.getFeedbackStatuses().subscribe(resProviderData => this.feedbackStatuses = resProviderData);

    this._feedbackservice.getEmailStatuses().subscribe(resProviderData => this.emailStatuses = resProviderData);

    this._feedbackservice.getFeedback(requestData)
    .subscribe(resProviderData => this.providers(resProviderData));
    this.maxDate = new Date();
    this.feedBackDiv = true;


    this.providerServiceMapID=this._saved_data.current_service.serviceID;
    this.current_agent= this._saved_data.uname;
    this.userId=this._saved_data.uid;
  }


  onSubmit() {


    // this.action = "view";
    let bodyString = this.feedbackForm.value;
    bodyString['serviceID'] = this.serviceID;
    // bodyString['feedbackStatus'] = undefined;
    // bodyString['emailStatus'] = undefined;
    // bodyString[ "" ] = undefined;
    console.log('SPData' + JSON.stringify(bodyString));
    // bodyString.feedbackStatus = undefined;
    // bodyString.emailStatus = undefined;
    if (this.action == 'edit') {
      bodyString['feedbackRequestID'] = undefined;
      this.saveNSendEmail(this.feedbackForm.value.feedbackSupSummary, bodyString);
    }
    // if(this.action == 'edit')
    // this._feedbackservice.updateFeedback( bodyString )
    //   .subscribe( resfeedbackData => this.showUsers( resfeedbackData ) )

    if (this.action == 'update') {

      let kmFileManager = undefined;
      if(this.file!=undefined)
      {
        kmFileManager={
          "fileName": (this.file != undefined) ? this.file.name : '',
          "fileExtension": (this.file != undefined) ? '.' + this.file.name.split('.')[1] : '',
          "providerServiceMapID": this.providerServiceMapID,
          "userID": this.userId,
          "fileContent": (this.fileContent != undefined) ? this.fileContent.split(',')[1] : '',
          "createdBy": this.current_agent
        }

      }
      bodyString['kmFileManager']=kmFileManager;
      bodyString['feedbackResponseID'] = undefined;
      this._feedbackservice.updateResponce(bodyString)
      .subscribe((resfeedbackData) => {
        this.alertMessage.alert('Successfully Updated.');
        this.showUsers(resfeedbackData)
      }, (err) => {
        this.alertMessage.alert(err.status);
      })
    }

  }

  showUsers(data) {
    this.onSearch()
  }

  providers(data) {

    this.action = "view";
    this.feedbackList = data;
    this.showUser = true;
    // this.showupdateFeedback = true;
    // this.showupdateFeedback1 = true;
    console.log(data);
  }

  showUser1(data1) {

  }



  requestFeedback(feedback) {
    // this.showupdateFeedback=!this.showupdateFeedback;
    this.action = 'edit';

    this.feedbackForm.controls.feedbackID.setValue(feedback.feedbackID);
    this.feedbackForm.controls.feedbackSupSummary.setValue(
                                                           feedback.feedbackRequests ?
                                                           (
                                                            feedback.feedbackRequests[0] ?
                                                            (
                                                             feedback.feedbackRequests[0].feedbackSupSummary ? feedback.feedbackRequests[0].feedbackSupSummary : feedback.feedback
                                                             )
                                                            : feedback.feedback
                                                            )
                                                           : feedback.feedback
                                                           );
    this.feedbackForm.controls.comments.setValue(
                                                 feedback.feedbackRequests ?
                                                 (
                                                  feedback.feedbackRequests[0] ?
                                                  (
                                                   feedback.feedbackRequests[0].comments ? feedback.feedbackRequests[0].comments : ""
                                                   )
                                                  : ""
                                                  )
                                                 : ""
                                                 );
    this.feedbackForm.controls.beneficiaryName.setValue(feedback.beneficiaryName);
    // this.feedbackForm.controls.createdDate.setValue(feedback.CreatedDate);
    this.feedbackForm.controls.feedbackDate.setValue(new Date(feedback.createdDate).toLocaleDateString('en-in'));
    this.feedbackForm.controls.feedbackTypeName.setValue(feedback.feedbackTypeName);
    this.feedbackForm.controls.feedbackStatusName.setValue(feedback.feedbackStatusName);
    this.feedbackStatusName = feedback.feedbackStatusName;
    this.feedbackForm.controls.emailStatusName.setValue(feedback.emailStatusName);
    this.feedbackForm.controls.feedbackStatusID.setValue(feedback.feedbackStatusID);
    this.feedbackForm.controls.emailStatusID.setValue(feedback.emailStatusID);
    // this.feedbackForm.controls.institutionName.setValue(feedback.institutionName);instituteType
    this.feedbackForm.controls.institutionName.setValue(
                                                        feedback.instituteType ? (
                                                                                  feedback.instituteType.institutionType ? feedback.instituteType.institutionType : undefined
                                                                                  ) : undefined
                                                        );
    this.feedbackForm.controls.designationName.setValue(feedback.designationName);
    this.feedbackForm.controls.severityTypeName.setValue(feedback.severityTypeName);
    this.feedbackForm.controls.serviceName.setValue(feedback.serviceName);
    this.feedbackForm.controls.userName.setValue(feedback.userName);
    this.feedbackForm.controls.smsPhoneNo.setValue(feedback.smsPhoneNo);
    this.feedbackForm.controls.modifiedBy.setValue(feedback.modifiedBy);
    if(feedback.serviceAvailDate)
    {
      this.feedbackForm.controls.incidentDate.setValue(new Date(feedback.serviceAvailDate).toLocaleDateString('en-in'));

    }
    // this.feedbackForm.controls.incidentDate.setValue(new Date(feedback.serviceAvailDate).toLocaleDateString('en-in'));
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
    this.feedBackRequestsResponse = feedback.feedbackRequests;
    this.feedBackResponses = feedback.feedbackResponses;
    this.consolidatedRequests = feedback.consolidatedRequests;
    let requestsLength = feedback.feedbackRequests.length();
    let responsesLength = feedback.feedbackResponses.length();
    /*
     end
     */

     this.isCollapsedResponse = true;


   }

   updateResponse(feedback) {

    // this.showupdateFeedback=!this.showupdateFeedback;
    this.action = 'update';

    this.feedbackForm.controls.feedbackID.setValue(feedback.feedbackID);
    this.feedbackForm.controls.feedbackSupSummary.setValue(
                                                           feedback.feedbackRequests ?
                                                           (
                                                            feedback.feedbackRequests[0] ?
                                                            (
                                                             feedback.feedbackRequests[0].feedbackSupSummary ? feedback.feedbackRequests[0].feedbackSupSummary : feedback.feedback
                                                             )
                                                            : feedback.feedback
                                                            )
                                                           : feedback.feedback
                                                           );
    this.feedbackForm.controls.feedbackRequestID.setValue(
                                                          feedback.feedbackRequests ?
                                                          (
                                                           feedback.feedbackRequests[0] ?
                                                           (
                                                            feedback.feedbackRequests[0].feedbackRequestID ? feedback.feedbackRequests[0].feedbackRequestID : undefined
                                                            )
                                                           : undefined
                                                           )
                                                          : undefined
                                                          );
    this.feedbackForm.controls.comments.setValue(
                                                 feedback.feedbackResponses ?
                                                 (
                                                  feedback.feedbackResponses[0] ?
                                                  (
                                                   feedback.feedbackResponses[0].comments ? feedback.feedbackResponses[0].comments : ""
                                                   )
                                                  : ""
                                                  )
                                                 : ""
                                                 );
    this.feedbackForm.controls.beneficiaryName.setValue(feedback.beneficiaryName);
    // this.feedbackForm.controls.createdDate.setValue(feedback.CreatedDate);
    this.feedbackForm.controls.feedbackDate.setValue(new Date(feedback.createdDate).toLocaleDateString('en-in'));
    this.feedbackForm.controls.feedbackTypeName.setValue(feedback.feedbackTypeName);
    this.feedbackForm.controls.feedbackStatusName.setValue(feedback.feedbackStatusName);
    this.feedbackStatusName = feedback.feedbackStatusName;
    this.feedbackForm.controls.emailStatusName.setValue(feedback.emailStatusName);
    this.feedbackForm.controls.feedbackStatusID.setValue(feedback.feedbackStatusID);
    this.feedbackForm.controls.emailStatusID.setValue(feedback.emailStatusID);
    // this.feedbackForm.controls.institutionName.setValue(feedback.institutionName);
    this.feedbackForm.controls.institutionName.setValue(
                                                        feedback.instituteType ? (
                                                                                  feedback.instituteType.institutionType ? feedback.instituteType.institutionType : undefined
                                                                                  ) : undefined
                                                        );
    this.feedbackForm.controls.designationName.setValue(feedback.designationName);
    this.feedbackForm.controls.severityTypeName.setValue(feedback.severityTypeName);
    this.feedbackForm.controls.serviceName.setValue(feedback.serviceName);
    this.feedbackForm.controls.userName.setValue(feedback.userName);
    this.feedbackForm.controls.smsPhoneNo.setValue(feedback.smsPhoneNo);
    this.feedbackForm.controls.modifiedBy.setValue(feedback.modifiedBy);
    if(feedback.serviceAvailDate)
    {
      this.feedbackForm.controls.incidentDate.setValue(new Date(feedback.serviceAvailDate).toLocaleDateString('en-in'));

    }
    // this.feedbackForm.controls.incidentDate.setValue(new Date(feedback.serviceAvailDate).toLocaleDateString('en-in'));
    this.feedbackForm.controls.createdBy.setValue(feedback.createdBy)
    //  this.feedbackForm.controls.feedbackID.setValue(feedback.FeedbackID);

    /*
     editor:Diamond Khanna
     date:16 Aug,2017
     */
     this.feedBackRequestsResponse = feedback.feedbackRequests;
     this.feedBackResponses = feedback.feedbackResponses;
     this.consolidatedRequests = feedback.consolidatedRequests;

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
      this.feedbackForm1.controls.beneficiaryName.setValue(feedback.beneficiaryName);
      this.feedbackForm1.controls.createdBy.setValue(feedback.createdBy);
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

  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
                          date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };

  updateTimeOffset(date: Date) {
    //(this.DOB) - 1 * (this.DOB.getTimezoneOffset() * 60 * 1000)
    date = new Date(date.valueOf() - 1 * date.getTimezoneOffset() * 60 * 1000);
    return date;
  }
  onSearch() {
    let bodyString = this.feedbackForm2.value;
    // bodyString.endDate = new Date(this.feedbackForm2.value.endDate);
    if (bodyString.endDate === '') {
      bodyString.endDate = undefined;
    } else {
      bodyString.endDate.setHours(23, 59, 59);
      bodyString.endDate = this.updateTimeOffset(bodyString.endDate);
    }
    if (bodyString.startDate === '') {
      bodyString.startDate = undefined;
    } else {
      bodyString.startDate.setHours(0, 0, 0);
      bodyString.startDate = this.updateTimeOffset(bodyString.startDate);
    }
    if (bodyString.feedbackID === '') {
      bodyString.feedbackID = undefined;
    }

    bodyString['serviceID'] = this.serviceID;
    // this._feedbackservice.searchFeedback( bodyString )
    //   .subscribe( resProviderData => this.providers( resProviderData ) );
    this._feedbackservice.getFeedback(bodyString)
    .subscribe((resProviderData) => {
      this.providers(resProviderData)
    },
    (err) => {
      this.alertMessage.alert(err.status);
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
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  saveNSendEmail(feedback: any, bodyString: any) {
    let dialogReff = this.dialog.open(AlernateEmailModelComponent, {
      height: '350px',
      width: '620px',
      disableClose: true,
      data: feedback
    });
    dialogReff.afterClosed().subscribe(result => {

      if(result!="close")
      {
        this._feedbackservice.requestFeedback(bodyString)
        .subscribe(resfeedbackData =>
                   this.showUsers(resfeedbackData), err => {
                    this.alertMessage.alert(err.status);
                  })
      }
      
    });

  }
  back() {
    this.action = "view";
  }


  maxFileSize = 5;
  fileList: FileList;
  error1: boolean = false;
  error2: boolean = false;
  error3: boolean = false;

  file: any;
  fileContent: any;

  onFileUpload(event) {
    this.fileList = event.target.files;
    this.file = event.target.files[0];
    console.log(this.file);
    if (this.file) {
      const myReader: FileReader = new FileReader();
      myReader.onloadend = this.onLoadFileCallback.bind(this)
      myReader.readAsDataURL(this.file);
    }
    if (this.fileList.length == 0) {
      this.error1 = true;
      this.error2 = false;
      this.error3 = false;
    }
    else if (this.fileList.length > 0 && this.fileList[0].size / 1000 / 1000 <= this.maxFileSize) {
      console.log(this.fileList[0].size / 1000 / 1000);
      this.error1 = false;
      this.error2 = false;
      this.error3 = false;
    }
    else if (this.fileList[0].size / 1000 / 1000 == 0) {
      console.log(this.fileList[0].size / 1000 / 1000);
      this.error2 = false;
      this.error1 = false;
      this.error3 = true
    }
    else if (this.fileList[0].size / 1000 / 1000 > this.maxFileSize) {
      console.log(this.fileList[0].size / 1000 / 1000);
      this.error2 = true;
      this.error1 = false;
      this.error3 = false;
    }

  }
  onLoadFileCallback = (event) => {
    this.fileContent = event.currentTarget.result;
  }

}
