import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { OutboundSearchRecordService } from '../services/outboundServices/outbound-search-records.service';
import { dataService } from '../services/dataService/data.service';
declare var jQuery: any;

@Component({
  selector: 'app-outbound-search-records',
  templateUrl: './outbound-search-records.component.html',
  styleUrls: ['./outbound-search-records.component.css'],
})

export class OutboundSearchRecordsComponent implements OnInit {
  public showCreateFlag = false;
  serviceProviders: string[];
  data: any;
  count: any;
  records: any;
  showFlage: boolean = false;
  _unAllocatedCalls: any;
  serviceProviderMapID: number;

  tot_unAllocatedCalls: any;

  constructor(
    private _OSRService: OutboundSearchRecordService,
    private saved_data: dataService
  ) {

  }

  ngOnInit() {
    this.serviceProviderMapID = this.saved_data.current_service.serviceID;
    this._OSRService.getUnallocatedCalls(this.serviceProviderMapID)
      .subscribe(resProviderData => {
        this._unAllocatedCalls = resProviderData.data;

        this.tot_unAllocatedCalls = this._unAllocatedCalls.length;
      });

  }
  // assignCount(length: any) {
  //   debugger;
  //   this.tot_unAllocatedCalls = length;
  // }
  allocateCalls(values: any, event) {

    console.log('valuse: ' + values);

    for (var i = 0; i < event.target.parentNode.parentNode.parentNode.children.length; i++) {
      event.target.parentNode.parentNode.parentNode.children[i].className = '';
    }
    event.target.parentNode.parentNode.className = 'highlightTrBg';
    this.showFlage = true;
    this.records = values;
  }
}
