import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { FeedbackService } from '../services/supervisorServices/Feedbackservice.service';
import { dataService } from '../services/dataService/data.service';
import { MdMenuTrigger, MdDatepicker } from '@angular/material';
import { CustomValidators } from 'ng2-validation';
import { MessageBag, ValidationMessagesService } from 'ng2-custom-validation';

@Component( {
  selector: 'supervisor-grievance',
  templateUrl: './grievance.component.html',
  styleUrls: [ './grievance.component.css' ],
  providers: [ FeedbackService ]
} )
export class supervisorFeedback implements OnInit 
{

  public showupdateFeedback = true;
  public showupdateFeedback1 = true;
  public action = "view";
  public showUser = true;
  feedbackList: any;
  feedbackresponceList: any;
  data: any;//it is am using for edit purpose;
  data1: any;
  serviceID: any;
  myDatepicker = '';
  myDatepicker1 = '';
  feedbackStatuses: any;
  emailStatuses: any;
  public showfeedbackstatus = 1
  error: any = { isError: false, errorMessage: '' };

  constructor(
    private _feedbackservice: FeedbackService,
    private _saved_data: dataService
  )
  {
    this.feedbackList;
    this.feedbackresponceList;
  }



  feedbackForm = new FormGroup( {
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
    serviceName: new FormControl(),
    userName: new FormControl(),
    smsPhoneNo: new FormControl(),
    modifiedBy: new FormControl(),
    updateResponse: new FormControl(),
    emailStatusID: new FormControl(),
    feedbackStatusID: new FormControl(),
    feedbackRequestID: new FormControl()
  } );

  feedbackForm1 = new FormGroup( {

    feedbackID: new FormControl(),
    feedbackSupSummary: new FormControl(),
    beneficiaryName: new FormControl(),
    comments: new FormControl(),
    createdBy: new FormControl(),
    createdDate: new FormControl(),
    supUserID: new FormControl( "1" ),
    startDate: new FormControl(),
    complaintId: new FormControl(),
    endDate: new FormControl()


  } );


  feedbackForm3 = new FormGroup( {
    feedbackID: new FormControl()

  } )



  feedbackForm2 = new FormGroup( {

    feedbackID: new FormControl( '', CustomValidators.number ),

    startDate: new FormControl( '', CustomValidators.date ),
    endDate: new FormControl( '', CustomValidators.minDate( '2016-09-09' ) )
  } );





  ngOnInit ()
  {
    this.serviceID = this._saved_data.current_service.serviceID;
    let requestData = {};
    requestData[ "serviceID" ] = this.serviceID;
    this._feedbackservice.getFeedbackStatuses().subscribe( resProviderData => this.feedbackStatuses = resProviderData );

    this._feedbackservice.getEmailStatuses().subscribe( resProviderData => this.emailStatuses = resProviderData );
    this._feedbackservice.getFeedback( requestData )
      .subscribe( resProviderData => this.providers( resProviderData ) );
  }
  onSubmit ()
  {

    // this.action = "view";

    let bodyString = this.feedbackForm.value;
    bodyString[ "serviceID" ] = this.serviceID;
    bodyString[ "feedbackStatus" ] = undefined;
    bodyString[ "emailStatus" ] = undefined;
    // bodyString[ "" ] = undefined;
    console.log( "SPData" + JSON.stringify( bodyString ) );
    // bodyString.feedbackStatus = undefined;
    // bodyString.emailStatus = undefined;

    if ( this.action == 'edit' )
    {
      this._feedbackservice.requestFeedback( bodyString )
        .subscribe( resfeedbackData => this.showUsers( resfeedbackData ) )
    }
    //if(this.action == 'edit')
    // this._feedbackservice.updateFeedback( bodyString )
    //   .subscribe( resfeedbackData => this.showUsers( resfeedbackData ) )

    if ( this.action == 'update' )
    {
      this._feedbackservice.updateResponce( bodyString )
        .subscribe( resfeedbackData => this.showUsers( resfeedbackData ) )
    }

  }

  showUsers ( data )
  {
    this.onSearch();
  }

  providers ( data )
  {
    this.feedbackList = data;
    this.showUser = true;
    this.showupdateFeedback = true;
    this.showupdateFeedback1 = true;
    console.log( data );
  }

  showUser1 ( data1 )
  {

  }



  requestFeedback ( feedback )
  {
    // this.showupdateFeedback=!this.showupdateFeedback;
    this.action = "edit";


    this.feedbackForm.controls.feedbackID.setValue( feedback.feedbackID );
    this.feedbackForm.controls.feedbackSupSummary.setValue(
      ( feedback.feedbackRequests && feedback.feedbackRequests[ 0 ] && feedback.feedbackRequests[ 0 ].feedbackSupSummary ) ?
        feedback.feedbackRequests[ 0 ].feedbackSupSummary : ""
    );
    this.feedbackForm.controls.beneficiaryName.setValue( feedback.beneficiaryName );
    //this.feedbackForm.controls.createdDate.setValue(feedback.CreatedDate);
    this.feedbackForm.controls.feedbackDate.setValue( new Date( feedback.createdDate ).toLocaleDateString( 'en-in' ) );
    this.feedbackForm.controls.feedbackTypeName.setValue( feedback.feedbackTypeName );
    this.feedbackForm.controls.feedbackStatus.setValue( feedback.feedbackStatusName );
    this.feedbackForm.controls.emailStatus.setValue( feedback.emailStatusName );
    this.feedbackForm.controls.feedbackStatusID.setValue( feedback.feedbackStatusID );
    this.feedbackForm.controls.emailStatusID.setValue( feedback.emailStatusID );
    this.feedbackForm.controls.institutionName.setValue( feedback.institutionName );
    this.feedbackForm.controls.designationName.setValue( feedback.designationName );
    this.feedbackForm.controls.severityTypeName.setValue( feedback.severityTypeName );
    this.feedbackForm.controls.serviceName.setValue( feedback.serviceName );
    this.feedbackForm.controls.userName.setValue( feedback.userName );
    this.feedbackForm.controls.smsPhoneNo.setValue( feedback.smsPhoneNo );
    this.feedbackForm.controls.modifiedBy.setValue( feedback.modifiedBy );
    this.feedbackForm.controls.createdBy.setValue( feedback.createdBy )
    //  this.feedbackForm.controls.feedbackID.setValue(feedback.FeedbackID);

  }

  updateResponse ( feedback )
  {

    //this.showupdateFeedback=!this.showupdateFeedback;
    this.action = "update";


    this.feedbackForm.controls.feedbackID.setValue( feedback.feedbackID );
    this.feedbackForm.controls.feedbackSupSummary.setValue(
      ( feedback.feedbackRequests && feedback.feedbackRequests[ 0 ] && feedback.feedbackRequests[ 0 ].feedbackSupSummary ) ?
        feedback.feedbackRequests[ 0 ].feedbackSupSummary : ""
    );
    this.feedbackForm.controls.feedbackRequestID.setValue(
      ( feedback.feedbackRequests && feedback.feedbackRequests[ 0 ] && feedback.feedbackRequests[ 0 ].feedbackRequestID ) ?
        feedback.feedbackRequests[ 0 ].feedbackRequestID : undefined
    );
    this.feedbackForm.controls.beneficiaryName.setValue( feedback.beneficiaryName );
    //this.feedbackForm.controls.createdDate.setValue(feedback.CreatedDate);
    this.feedbackForm.controls.feedbackDate.setValue( new Date( feedback.createdDate ).toLocaleDateString( 'en-in' ) );
    this.feedbackForm.controls.feedbackTypeName.setValue( feedback.feedbackTypeName );
    this.feedbackForm.controls.feedbackStatus.setValue( feedback.feedbackStatusName );
    this.feedbackForm.controls.emailStatus.setValue( feedback.emailStatusName );
    this.feedbackForm.controls.feedbackStatusID.setValue( feedback.feedbackStatusID );
    this.feedbackForm.controls.emailStatusID.setValue( feedback.emailStatusID );
    this.feedbackForm.controls.institutionName.setValue( feedback.institutionName );
    this.feedbackForm.controls.designationName.setValue( feedback.designationName );
    this.feedbackForm.controls.severityTypeName.setValue( feedback.severityTypeName );
    this.feedbackForm.controls.serviceName.setValue( feedback.serviceName );
    this.feedbackForm.controls.userName.setValue( feedback.userName );
    this.feedbackForm.controls.smsPhoneNo.setValue( feedback.smsPhoneNo );
    this.feedbackForm.controls.modifiedBy.setValue( feedback.modifiedBy );
    this.feedbackForm.controls.createdBy.setValue( feedback.createdBy )
    //  this.feedbackForm.controls.feedbackID.setValue(feedback.FeedbackID);

  }


  onSend ( feedback )
  {
    console.log( feedback );
    console.log( "SPData" + JSON.stringify( feedback ) );
    let dataforUpdate = feedback;
    dataforUpdate[ "serviceID" ] = this.serviceID;

    this.feedbackForm1.controls.feedbackID.setValue( feedback.feedbackID );
    this.feedbackForm1.controls.feedbackSupSummary.setValue( feedback.feedback );
    this.feedbackForm1.controls.beneficiaryName.setValue( feedback.beneficiaryName );
    this.feedbackForm1.controls.createdBy.setValue( feedback.createdBy );
    this.feedbackForm1.controls.createdDate.setValue( feedback.createdDate );

    console.log( "raj" + dataforUpdate )
    let bodyString = this.feedbackForm1.value;
    this._feedbackservice.requestFeedback( bodyString )
      .subscribe( resfeedbackData => this.showUsers( resfeedbackData ) )
    // this._feedbackservice.updateStatus( bodyString )
    //   .subscribe( resfeedbackData => this.showUsers( resfeedbackData ) )


  }
  showForm ()
  {
    this.showUser = !this.showUser;

  }

  onSearch ()
  {
    let bodyString = this.feedbackForm2.value;
    if ( bodyString.endDate === "" )
    {
      bodyString.endDate = undefined;
    }
    if ( bodyString.startDate === "" )
    {
      bodyString.startDate = undefined;
    }
    if ( bodyString.feedbackID === "" )
    {
      bodyString.feedbackID = undefined;
    }
    bodyString[ "serviceID" ] = this.serviceID;
    // this._feedbackservice.searchFeedback( bodyString )
    //   .subscribe( resProviderData => this.providers( resProviderData ) );
    this._feedbackservice.getFeedback( bodyString )
      .subscribe( resProviderData => this.providers( resProviderData ) );
  }

  onClick ( feedback )
  {
    this.action = "Click";
    this.feedbackForm3.controls.feedbackID.setValue( feedback.FeedBackID );
    let bodyString = this.feedbackForm3.value;
    this._feedbackservice.responce( bodyString )
      .subscribe( resProviderData => this.showResponce( resProviderData ) );

  }
  showResponce ( data1 )
  {
    this.feedbackresponceList = data1;
    console.log( this.feedbackresponceList )
    console.log( "SPData" + JSON.stringify( data1 ) );


  }

  compareTwoDates ()
  {
    if ( new Date( this.feedbackForm2.controls[ 'endDate' ].value ) < new Date( this.feedbackForm2.controls[ ' startDate' ].value ) )
    {
      this.error = { isError: true, errorMessage: 'End Date can not before start date' };
    }
  }




}
