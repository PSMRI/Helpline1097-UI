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


  constructor(
    private _OSRService: OutboundSearchRecordService,
    private saved_data: dataService,
    private _callServices: CallServices, public alertService: ConfirmationDialogsService
  ) {

  }

  ngOnInit() {
    this.serviceProviderMapID = this.saved_data.current_service.serviceID; 
    //  this.endOutboundDate.setDate(this.startOutboundDate.getDate() + 7);
    this.getOutboundCallCount(this.serviceProviderMapID);
    this.getLanguages();
    this.showCount = false;
  }
  assignCount(data: any) {
    this.getOutboundCallCount(data.providerServiceMapId, data.language);
    this.showCount = false;
  }
  getOutboundCallCount(serviceProviderMapID,  language?: any) {
    this._OSRService.getEverwellUnallocatedCallsCount(serviceProviderMapID, language)
      .subscribe(resProviderData => {
        this._unAllocatedCalls = [{count: 2, language: "All"}];
       
        
        // this.tot_unAllocatedCalls = this._unAllocatedCalls.length;
        this.showCount = true;
        this.selectedlang = language;
      }),(err) => {
        this.alertService.alert(err.errorMessage,'error');
      }
  }
  allocateCalls(language: any, event) {
    // console.log('valuse: ' + values);
    if (this._unAllocatedCalls.length > 0) {
      this.showFlage = true;
    }
    const outboundObj = {};
    //  outboundObj['outboundList'] = values;
  
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
  // start search on start and end date 
  // getUnallocateCall(values) {
  //   // tslint:disable-next-line:max-line-length
  //   this.showFlage = false;
  //   let startDate: Date = new Date(values.filterStartDate);
  //   let endDate: Date = new Date(values.filterEndDate);

  //   startDate.setHours(0);
  //   startDate.setMinutes(0);
  //   startDate.setSeconds(0);
  //   startDate.setMilliseconds(0);

  //   endDate.setHours(23);
  //   endDate.setMinutes(59);
  //   endDate.setSeconds(59);
  //   endDate.setMilliseconds(0);

  //   startDate = new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000);
  //   endDate = new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000);
    
  //   if (!values.preferredLanguageName || values.preferredLanguageName === 'undefined') {
  //     this.getOutboundCallCount(this.serviceProviderMapID, startDate,
  //       endDate);
  //     this.selectedlangflag = false;
  //   } else {
  //     this.getOutboundCallCount(this.serviceProviderMapID, startDate,
  //       endDate, values.preferredLanguageName.languageName);
  //     this.selectedlangflag = true;
  //   }
  // }
  // end

  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

}
