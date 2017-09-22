import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { CallServices } from './../services/callservices/callservice.service';
import { dataService } from './../services/dataService/data.service';

@Component({
  selector: 'app-outbond-worklist',
  templateUrl: './outbond-worklist.component.html',
  styleUrls: ['./outbond-worklist.component.css']
})

export class OutbondWorklistComponent implements OnInit {
  @Output() onOutboundCall: EventEmitter<any> = new EventEmitter<any>();
  data: any;
  constructor(private _outBoundService: CallServices, private _common: dataService) {
  }

  ngOnInit() {
    const serviceProviderMapID = this._common.current_service.serviceID;
    const userId = this._common.uid;
    this._outBoundService.getOutboundCallList(serviceProviderMapID, userId).subscribe((response) => {
      this.AssignData(response);
      console.log('Call History Data is', response);
    }, (err) => {
      console.log('error in call history ');
    })
  };

  AssignData(outboundHistory: any) {
    this.data = outboundHistory;
  }
  //   modaldata:any;
  viewHistory(data: any) {
    this.onOutboundCall.emit(data);
  }

}
