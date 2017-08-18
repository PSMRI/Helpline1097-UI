import { Component, OnInit, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { CallServices } from '../services/callservices/callservice.service'
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';



@Component( {
  selector: 'app-closure',
  templateUrl: './closure.component.html',
  styleUrls: [ './closure.component.css' ]
} )
export class ClosureComponent implements OnInit
// export class ClosureComponent implements AfterViewInit
{

   @Input() current_language: any;
  currentlanguage: any;

  @Output() callClosed: EventEmitter<any> = new EventEmitter<any>();

  summaryList: any = [];
  showCallSummary: boolean = false;
  remarks: any;
  callClosureType: any;
  calltypes: any = [];
  isFollowupRequired: boolean = false;
  prefferedDateTime: any;
  callTypeID: any;
  minDate: Date;
  maxDate: Date;
  isFollowUp;
  followUpDate: any;
  picker = '';

  today: Date;

  showSlider: boolean;

  constructor(
    private _callServices: CallServices,
    private saved_data: dataService,
    private message: ConfirmationDialogsService
  ) { }
  /* Intialization of variable and object has to be come here */
  ngOnInit ()
  {
    const requestObject = { 'providerServiceMapID': this.saved_data.current_service.serviceID };
    this.isFollowUp = false;
    this._callServices.getCallTypes( requestObject ).subscribe( response => this.populateCallTypes( response ) );

    this.today = new Date();
    this.minDate = this.today;
    this.showSlider = false;
  }


   ngOnChanges()
    {
      this.setLanguage(this.current_language);

    }

  setLanguage(language) {
    this.currentlanguage = language;
    console.log(language, "language closure tak");
  }

  sliderVisibility(val)

  {
    if ( val === "Valid Call" )
    {
      this.showSlider = true;
    }
    else
    {
      this.showSlider = false;
    }
  }

  populateCallTypes ( response: any )
  {
    console.log( "hi", response );
    this.calltypes = response;
  }
  // @Input()
  onView ()
  {
    const requestObject = { 'benCallID': this.saved_data.callData.benCallID };
    this._callServices.getCallSummary( requestObject ).subscribe( response => this.populateCallSummary( response ) );
  }
  populateCallSummary ( response: any )
  {
    this.summaryList = [];
    console.log( JSON.stringify( response ) );
    this.summaryList = response;

    this.showCallSummary = false;
    if ( this.summaryList.length > 0 )
    {
      this.showCallSummary = true;
    }
  }

  closeCall ( values: any )
  {
    values.benCallID = this.saved_data.callData.benCallID;
    values.beneficiaryRegID = this.saved_data.beneficiaryData.beneficiaryRegID;
    values.providerServiceMapID = this.saved_data.current_service.serviceID;

    //Gursimran to look at fixing of followupRequired issue
    if ( values.isFollowupRequired == undefined )
    {
      values.isFollowupRequired = false;
    }

    if ( values.prefferedDateTime )
    {
      values.prefferedDateTime = new Date( values.prefferedDateTime );
      values.prefferedDateTime
        = new Date(( values.prefferedDateTime ) - 1 * ( values.prefferedDateTime.getTimezoneOffset() * 60 * 1000 ) ).toJSON();
    } else
    {
      values.preferredDateTime = undefined;
    }
    values.createdBy = this.saved_data.uname;
    values.fitToBlock = values.callTypeID.split( "," )[ 1 ];
    values.callTypeID = values.callTypeID.split( "," )[ 0 ];
    console.log( 'close called with ' + values );
    this._callServices.closeCall( values ).subscribe(( response ) =>
    {
      this.callClosed.emit();
      this.showAlert();
    }, ( err ) =>
      {
        this.message.alert( err.status );
      } );
  }

  showAlert ()
  {
    this.message.alert( 'Call closed Successful!!!!' );
    // alert('Call closed Successful!!!!');
  }
  isFollow ( e )
  {
    if ( e.checked )
    {

      this.isFollowUp = true;
      this.isFollowupRequired = true
    } else
    {
      this.isFollowUp = false;
      this.isFollowupRequired = false;
    }

  }
}
