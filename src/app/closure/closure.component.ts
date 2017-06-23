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

  constructor(
    private _callServices: CallServices,
    private saved_data: dataService
  ) { }

  ngOnInit ()
  // ngAfterViewInit ()
  {
    // let requestObject = { 'benCallID': this.saved_data.callData.benCallID };
    // this._callServices.getCallSummary( requestObject ).subscribe( response => this.populateCallSummary( response ) );
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
