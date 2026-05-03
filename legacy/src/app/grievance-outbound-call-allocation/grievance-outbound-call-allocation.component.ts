import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { OutboundSearchRecordService } from '../services/outboundServices/outbound-search-records.service';
import { dataService } from '../services/dataService/data.service';
import { CallServices } from '../services/callservices/callservice.service'
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-grievance-outbound-call-allocation',
  templateUrl: './grievance-outbound-call-allocation.component.html',
  styleUrls: ['./grievance-outbound-call-allocation.component.css']
})
export class GrievanceOutboundCallAllocationComponent implements OnInit {
  records: any;
  showFlag: boolean = false;
  unAllocatedGrievanceCalls: any;
  serviceProviderMapID: number;
  languages: any = [];
  showCount: boolean = false;
  startOutboundDate: Date;
  endOutboundDate: Date;
  preferredLanguageName: any = undefined;
  selectedLanguage: any;
  selectedLangFlag: boolean = false;
  currentLanguageSet: any;
  enableTableData = false;

  constructor(
    private outboundSearchRecordService: OutboundSearchRecordService,
    private savedData: dataService,
    private callServices: CallServices,
    public alertService: ConfirmationDialogsService,
    public httpServices: HttpServices
  ) {

  }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.serviceProviderMapID = this.savedData.current_service.serviceID;
    this.startOutboundDate = new Date();
		let start = new Date((this.startOutboundDate.getTime()) - 1 * (this.startOutboundDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
		this.endOutboundDate = new Date();
    this.endOutboundDate.setDate(this.endOutboundDate.getDate() + 7);
		let end = new Date((this.endOutboundDate.getTime()) - 1 * (this.endOutboundDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.000Z";
    this.getOutboundCallCount(this.serviceProviderMapID, start, end);
    this.getLanguages();
    this.showCount = false;
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  assignCount(data: any) {
    this.getOutboundCallCount(data.providerServiceMapId, data.startDate, data.endDate, data.language);
    this.showCount = false;
  }
  getOutboundCallCount(serviceProviderMapID, startDate?: any, endDate?: any, language?: any) {
   this.outboundSearchRecordService.getUnallocatedGrievanceCallsCount(serviceProviderMapID, startDate, endDate, language)
      .subscribe(resProviderData => {
        this.unAllocatedGrievanceCalls = resProviderData.data;
        this.showCount = true;
        this.enableTableData = true;
        this.selectedLanguage = language;
      },(err) => {
        this.alertService.alert(err.errorMessage,'error');
      }
    );
  }
  allocateCalls(startDate: Date, endDate: Date, language: any, count:any) {
    if (this.unAllocatedGrievanceCalls && this.unAllocatedGrievanceCalls.length > 0) {
      this.showFlag = true;
    }
    const outboundObj = {};
    outboundObj['startDate'] = startDate;
    outboundObj['endDate'] = endDate;
    if (language || language !== "") {
      outboundObj['langaugeName'] = { langName: language };
    }
    outboundObj['noOfRecords'] = count;
    outboundObj['isAllocate'] = true;
    this.records = outboundObj;
  }
  getLanguages() {
    this.callServices.getLanguages().subscribe(response => {
      this.languages = response;
    }, (err) => {
      this.alertService.alert(err.errorMessage,'error');

    });
  }
  getUnallocateCall(values) {
    this.showFlag = false;
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
      this.selectedLangFlag = false;
    } else {
      this.getOutboundCallCount(this.serviceProviderMapID, startDate,
        endDate, values.preferredLanguageName.languageName);
      this.selectedLangFlag = true;
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
    this.enableTableData = false;
  }

}
