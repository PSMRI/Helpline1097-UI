import { Component, OnInit, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
import { UserBeneficiaryData } from "../services/common/userbeneficiarydata.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { dataService } from '../services/dataService/data.service';
import { CallServices } from '../services/callservices/callservice.service'

@Component( {
  selector: 'app-closure',
  templateUrl: './closure.component.html',
  styleUrls: [ './closure.component.css' ]
} )
export class ClosureComponent implements OnInit
// export class ClosureComponent implements AfterViewInit
{
  @Output() callClosed: EventEmitter<any> = new EventEmitter<any>();

  summaryList: any = [];
  showCallSummary: boolean = false;
  remarks: any;
  callClosureType: any;
  calltypes: any = [];
  isFollowupRequired: boolean = false;
  preferredDateTime: any;

  constructor(
    private _callServices: CallServices,
    private saved_data: dataService
  ) { }

  ngOnInit ()
  {
    let requestObject = { 'providerServiceMapID': this.saved_data.current_service.serviceID };
    this._callServices.getCallTypes( requestObject ).subscribe( response => this.populateCallTypes( response ) );
  }

  populateCallTypes ( response: any )
  {
    this.calltypes = response;
  }
  // @Input()
  onView ()
  {
    let requestObject = { 'benCallID': this.saved_data.callData.benCallID };
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
    if ( values.preferredDateTime )
    {
      values.preferredDateTime = new Date( values.preferredDateTim );
      values.preferredDateTime = new Date(( values.preferredDateTim ) - 1 * ( values.preferredDateTim.getTimezoneOffset() * 60 * 1000 ) ).toJSON();
    } else
    {
      values.preferredDateTim = undefined;
    }
    values.requestedFor = undefined;//requestedFor
    values.createdBy = this.saved_data.uname;
    console.log( "close called with " + values );
    this._callServices.closeCall( values ).subscribe( response =>
    {
      this.callClosed.emit();
      this.showAlert();
    } );
  }

  showAlert ()
  {
    alert( 'Call closed Successful!!!!' );
  }
}
