import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { OutboundSearchRecordService } from '../services/outboundServices/outbound-search-records.service';
import { dataService } from '../services/dataService/data.service';
import { CallServices } from '../services/callservices/callservice.service'
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
  languages: any = [];
  tot_unAllocatedCalls: any;
  showCount: boolean = false;

  constructor(
    private _OSRService: OutboundSearchRecordService,
    private saved_data: dataService,
    private _callServices: CallServices
  ) {

  }

  ngOnInit() {
    this.serviceProviderMapID = this.saved_data.current_service.serviceID;
    this.getOutboundCall(this.serviceProviderMapID);
    this.getLanguages();
    this.showCount = false;
  }
  assignCount(data: any) {
    this.getOutboundCall(data.providerServiceMapId, data.startDate, data.endDate, data.language);
    this.showCount = false;
  }
  getOutboundCall(serviceProviderMapID, startDate?: any, endDate?: any, language?: any) {
    this._OSRService.getUnallocatedCalls(serviceProviderMapID, startDate, endDate, language)
      .subscribe(resProviderData => {
        this._unAllocatedCalls = resProviderData.data;
        this.tot_unAllocatedCalls = this._unAllocatedCalls.length;
        this.showCount = true;
      });
  }

  allocateCalls(values: any, startDate: Date, endDate: Date, language: any, event) {
    console.log('valuse: ' + values);
    if (this.tot_unAllocatedCalls > 0) {
      this.showFlage = true;
    }
    const outboundObj = {};
    outboundObj['outboundList'] = values;
    outboundObj['startDate'] = startDate;
    outboundObj['endDate'] = endDate;
    outboundObj['langauge'] = language;
    this.records = outboundObj;
  }
  getLanguages() {
    this._callServices.getLanguages().subscribe(response => {
      this.languages = response;
    }, (err) => {

    });
  }
  getUnallocateCall(values) {
    // tslint:disable-next-line:max-line-length
    this.showFlage = false;
    let startDate: Date = new Date(values.filterStartDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    let endDate: Date = new Date(values.filterEndDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    if (!values.preferredLanguageName) {
      this.getOutboundCall(this.serviceProviderMapID, startDate,
        endDate);
    } else {
      this.getOutboundCall(this.serviceProviderMapID, startDate,
        endDate, values.preferredLanguageName.languageName);
    }
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

}
