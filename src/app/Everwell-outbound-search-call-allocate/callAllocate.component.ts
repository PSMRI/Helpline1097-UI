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
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from 'app/services/http-services/http_services.service';

@Component({
  selector: 'everwell-allocate',
  templateUrl: './callAllocate.component.html',
  styleUrls: ['./callAllocate.component.css']
})

export class CallAllocateComponent implements OnInit {
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
    private _callServices: CallServices, public alertService: ConfirmationDialogsService,
    private HttpServices:HttpServices
  ) {

  }

  ngOnInit() {
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
    this.assignSelectedLanguage();
  }
  assignCount(data: any) {
    let fromDate = new Date((data.startDate) - 1 * (data.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
    let toDate= new Date((data.endDate) - 1 * (data.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z";
    this.getOutboundCallCount(data.providerServiceMapId, fromDate, toDate, data.language);
    this.showCount = false;
  }
  getOutboundCallCount(serviceProviderMapID,  startDate?: any, endDate?: any,language?: any) {
    this._OSRService.getEverwellUnallocatedCallsCount(serviceProviderMapID,startDate,endDate, language)
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
  //start search on start and end date 
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
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
		const getLanguageJson = new SetLanguageComponent(this.HttpServices);
		getLanguageJson.setLanguage();
		this.currentLanguageSet = getLanguageJson.currentLanguageObject;
	  }
    disableTable() {
      this.enabletableData = false;
    }
}
