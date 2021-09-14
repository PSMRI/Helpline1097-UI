import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { OutboundSearchRecordService } from '../services/outboundServices/outbound-search-records.service';
import { dataService } from '../services/dataService/data.service';
import { CallServices } from '../services/callservices/callservice.service'
declare var jQuery: any;
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

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
  startOutboundDate: Date;
  endOutboundDate: Date;
  preferredLanguageName: any = undefined;
  selectedlang: any;
  selectedlangflag: boolean = false;
  currentLanguageSet: any;
enabletableData = false;

  constructor(
    private _OSRService: OutboundSearchRecordService,
    private saved_data: dataService,
    private _callServices: CallServices, public alertService: ConfirmationDialogsService,public HttpServices: HttpServices
  ) {

  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.serviceProviderMapID = this.saved_data.current_service.serviceID;
    // this.startOutboundDate = new Date();
    // this.endOutboundDate = new Date();
    // this.endOutboundDate.setDate(this.endOutboundDate.getDate() + 7);
    // this.startOutboundDate.setHours(0,0,0,0);
    // this.endOutboundDate.setHours(0,0,0,0);

    this.startOutboundDate = new Date();
		let start = new Date((this.startOutboundDate.getTime()) - 1 * (this.startOutboundDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
		this.endOutboundDate = new Date();
    this.endOutboundDate.setDate(this.endOutboundDate.getDate() + 7);
		let end = new Date((this.endOutboundDate.getTime()) - 1 * (this.endOutboundDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.000Z";
    //  this.endOutboundDate.setDate(this.startOutboundDate.getDate() + 7);
    this.getOutboundCallCount(this.serviceProviderMapID, start, end);
    this.getLanguages();
    this.showCount = false;
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  assignCount(data: any) {
    this.getOutboundCallCount(data.providerServiceMapId, data.startDate, data.endDate, data.language);
    this.showCount = false;
  }
  getOutboundCallCount(serviceProviderMapID, startDate?: any, endDate?: any, language?: any) {
    this._OSRService.getUnallocatedCallsCount(serviceProviderMapID, startDate, endDate, language)
      .subscribe(resProviderData => {
        this._unAllocatedCalls = resProviderData.data;
        // this.tot_unAllocatedCalls = this._unAllocatedCalls.length;
        this.showCount = true;
        this.enabletableData = true;
        this.selectedlang = language;
      }),(err) => {
        this.alertService.alert(err.errorMessage,'error');
      }
  }
  allocateCalls(startDate: Date, endDate: Date, language: any, event) {
    // console.log('valuse: ' + values);
    if (this._unAllocatedCalls.length > 0) {
      this.showFlage = true;
    }
    const outboundObj = {};
    //  outboundObj['outboundList'] = values;
    outboundObj['startDate'] = startDate;
    outboundObj['endDate'] = endDate;
    if (language || language !== "") {
      outboundObj['langaugeName'] = { langName: language };
    }
    this.records = outboundObj;
  }
  getLanguages() {
    this._callServices.getLanguages().subscribe(response => {
      this.languages = response;
      // this.languages.push({ languageID:, languageName: undefined });
    }, (err) => {
      this.alertService.alert(err.errorMessage,'error');

    });
  }
  getUnallocateCall(values) {
    // tslint:disable-next-line:max-line-length
    this.showFlage = false;
    let startDate: Date = new Date(values.filterStartDate);
    let endDate: Date = new Date(values.filterEndDate);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    startDate = new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000);
    endDate = new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000);
    
    if (!values.preferredLanguageName || values.preferredLanguageName === 'undefined') {
      this.getOutboundCallCount(this.serviceProviderMapID, startDate,
        endDate);
      this.selectedlangflag = false;
    } else {
      this.getOutboundCallCount(this.serviceProviderMapID, startDate,
        endDate, values.preferredLanguageName.languageName);
      this.selectedlangflag = true;
    }
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  disableTable() {
    this.enabletableData = false;
  }
}
