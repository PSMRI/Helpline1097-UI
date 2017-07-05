import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { FeedbackService } from '../services/supervisorServices/Feedbackservice.service';
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
  myDatepicker = '';
  myDatepicker1 = '';
  public showfeedbackstatus = 1
  error: any = { isError: false, errorMessage: '' };








  constructor( private _feedbackservice: FeedbackService )
  {
    this.feedbackList;
    this.feedbackresponceList;
  }



  feedbackForm = new FormGroup( {

    feedbackID: new FormControl(),
    feedbackSupSummary: new FormControl(),
    BeneficiaryRegID: new FormControl(),
    comments: new FormControl(),
    createdBy: new FormControl(),
    createdDate: new FormControl( "2017-05-20" ),
    supUserID: new FormControl( "1" ),
    FeedbackDate: new FormControl(),
    FeedbackTypeName: new FormControl(),
    FeedbackStatus: new FormControl(),
    EmailStatus: new FormControl( "2" ),
    InstitutionName: new FormControl(),
    DesignationName: new FormControl(),
    SeverityTypeName: new FormControl(),
    ServiceName: new FormControl(),
    UserName: new FormControl(),
    SMSPhoneNo: new FormControl(),
    ModifiedBy: new FormControl(),
    UpdateResponse: new FormControl(),
    emailStatusID: new FormControl(),
    selectStatus: new FormControl()



  } );

  feedbackForm1 = new FormGroup( {

    feedbackID: new FormControl(),
    feedbackSupSummary: new FormControl(),
    BeneficiaryRegID: new FormControl(),
    comments: new FormControl(),
    createdBy: new FormControl(),
    createdDate: new FormControl(),
    supUserID: new FormControl( "1" ),
    startDate: new FormControl(),
    ComplaintId: new FormControl(),
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
    this._feedbackservice.getFeedback()
      .subscribe( resProviderData => this.providers( resProviderData ) );
  }
  onSubmit ()
  {

    this.action = "view";

    let bodyString = this.feedbackForm.value;
    console.log( "SPData" + JSON.stringify( bodyString ) );

    if ( this.action == 'edit' )
      this._feedbackservice.updateFeedback( bodyString )
        .subscribe( resfeedbackData => this.showUsers( resfeedbackData ) )

    //if(this.action == 'edit')
    this._feedbackservice.updateFeedback( bodyString )
      .subscribe( resfeedbackData => this.showUsers( resfeedbackData ) )

    //if(this.action == 'update')
    this._feedbackservice.responceStatus( bodyString )
      .subscribe( resfeedbackData => this.showUsers( resfeedbackData ) )

  }

  showUsers ( data )
  {
    this.showUser = !this.showUser;
    console.log( "showUsers: " + data );
    this.showupdateFeedback = true;
    this.showupdateFeedback1 = true;

  }

  providers ( data )
  {
    this.feedbackList = data;
    console.log( data );
  }
  ;

  showUser1 ( data1 )
  {

  }



  updateFeedback ( feedback )
  {
    // this.showupdateFeedback=!this.showupdateFeedback;
    this.action = "edit";


    this.feedbackForm.controls.feedbackID.setValue( feedback.FeedBackID );
    this.feedbackForm.controls.feedbackSupSummary.setValue( feedback.Feedback );
    this.feedbackForm.controls.BeneficiaryRegID.setValue( feedback.BeneficiaryName );
    //this.feedbackForm.controls.createdDate.setValue(feedback.CreatedDate);
    this.feedbackForm.controls.FeedbackDate.setValue( feedback.CreatedDate );
    this.feedbackForm.controls.FeedbackTypeName.setValue( feedback.FeedbackTypeName );
    this.feedbackForm.controls.FeedbackStatus.setValue( feedback.FeedbackStatus );
    this.feedbackForm.controls.EmailStatus.setValue( feedback.EmailStatus );
    this.feedbackForm.controls.InstitutionName.setValue( feedback.InstitutionName );
    this.feedbackForm.controls.DesignationName.setValue( feedback.DesignationName );
    this.feedbackForm.controls.SeverityTypeName.setValue( feedback.SeverityTypeName );
    this.feedbackForm.controls.ServiceName.setValue( feedback.ServiceName );
    this.feedbackForm.controls.UserName.setValue( feedback.UserName );
    this.feedbackForm.controls.SMSPhoneNo.setValue( feedback.SMSPhoneNo );
    this.feedbackForm.controls.ModifiedBy.setValue( feedback.ModifiedBy );
    this.feedbackForm.controls.createdBy.setValue( feedback.CreatedBy )
    //  this.feedbackForm.controls.feedbackID.setValue(feedback.FeedbackID);

  }

  updateFeedback1 ( feedback )
  {

    //this.showupdateFeedback=!this.showupdateFeedback;
    this.action = "update";


    this.feedbackForm.controls.feedbackID.setValue( feedback.FeedBackID );
    this.feedbackForm.controls.feedbackSupSummary.setValue( feedback.Feedback );
    this.feedbackForm.controls.BeneficiaryRegID.setValue( feedback.BeneficiaryName );
    //this.feedbackForm.controls.createdDate.setValue(feedback.CreatedDate);
    this.feedbackForm.controls.FeedbackDate.setValue( feedback.CreatedDate );
    this.feedbackForm.controls.FeedbackTypeName.setValue( feedback.FeedbackTypeName );
    this.feedbackForm.controls.FeedbackStatus.setValue( feedback.FeedbackStatus );
    this.feedbackForm.controls.EmailStatus.setValue( feedback.EmailStatus );
    this.feedbackForm.controls.InstitutionName.setValue( feedback.InstitutionName );
    this.feedbackForm.controls.DesignationName.setValue( feedback.DesignationName );
    this.feedbackForm.controls.SeverityTypeName.setValue( feedback.SeverityTypeName );
    this.feedbackForm.controls.ServiceName.setValue( feedback.ServiceName );
    this.feedbackForm.controls.UserName.setValue( feedback.UserName );
    this.feedbackForm.controls.SMSPhoneNo.setValue( feedback.SMSPhoneNo );
    this.feedbackForm.controls.ModifiedBy.setValue( feedback.ModifiedBy );
    this.feedbackForm.controls.createdBy.setValue( feedback.CreatedBy )
    //  this.feedbackForm.controls.feedbackID.setValue(feedback.FeedbackID);

  }


  onSend ( feedback )
  {
    console.log( feedback );
    console.log( "SPData" + JSON.stringify( feedback ) );
    let dataforUpdate = feedback;

    this.feedbackForm1.controls.feedbackID.setValue( feedback.FeedBackID );
    this.feedbackForm1.controls.feedbackSupSummary.setValue( feedback.Feedback );
    this.feedbackForm1.controls.BeneficiaryRegID.setValue( feedback.BeneficiaryRegID );
    this.feedbackForm1.controls.createdBy.setValue( feedback.CreatedBy );
    this.feedbackForm1.controls.createdDate.setValue( "2017-06-19" );

    console.log( "raj" + dataforUpdate )
    let bodyString = this.feedbackForm1.value;
    this._feedbackservice.updateFeedback( bodyString )
      .subscribe( resfeedbackData => this.showUsers( resfeedbackData ) )
    this._feedbackservice.updateStatus( bodyString )
      .subscribe( resfeedbackData => this.showUsers( resfeedbackData ) )


  }
  showForm ()
  {
    this.showUser = !this.showUser;

  }

  onSearch ()
  {
    let bodyString = this.feedbackForm2.value;
    this._feedbackservice.searchFeedback( bodyString )
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
