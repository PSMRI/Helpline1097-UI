import { Component, OnInit } from '@angular/core';
import { SupervisorCallTypeReportService } from '../services/supervisorServices/supervisor-calltype-reports-service.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service'


@Component({
  selector: 'app-supervisor-calltype-reports',
  templateUrl: './supervisor-calltype-reports.component.html',
  styleUrls: ['./supervisor-calltype-reports.component.css']
})
export class SupervisorCalltypeReportsComponent implements OnInit {

  // ngmodels
  maxDate: Date;
  today: Date;


  callType: any;
  start_date: any;
  end_date: any;
  callTypeID: any;
  // arrays

  calltypes: any;
  callTypeObj: any;
  data: any;
  callSubTypes: any;
  // flags

  tableFlag: boolean;
  showPaginationControls: boolean;


  constructor(public _SupervisorCallTypeReportService: SupervisorCallTypeReportService,
    public commonDataService: dataService, private alertMessage: ConfirmationDialogsService) {

    this.tableFlag = false;
    this.today = new Date();


    this.data = [];

  }

  ngOnInit() {
    this.maxDate = new Date();
    let requestObject = { 'providerServiceMapID': this.commonDataService.current_service.serviceID };
    this._SupervisorCallTypeReportService.getCallTypes(requestObject).subscribe((response: Response) => {
      this.callTypeObj = response;
      this.populateCallTypes(response)
    });

    this.showPaginationControls = false;
  }

  setTableFlag(val) {
    this.tableFlag = val;
    this.get_filterCallList();
  }
  audioEvent() {
    this.alertMessage.alert('No Audio File Uploded.');
  }
  get_filterCallList() {
    let requestObj = {
      'calledServiceID': this.commonDataService.current_service.serviceID,
      'callTypeID': this.callTypeID,
      'filterStartDate': '',
      'filterEndDate': ''
    }

    if (this.start_date && this.end_date) {
      requestObj.filterStartDate = new Date((this.start_date) - 1 * (this.start_date.getTimezoneOffset() * 60 * 1000)).toJSON();
      requestObj.filterEndDate = new Date((this.end_date) - 1 * (this.end_date.getTimezoneOffset() * 60 * 1000)).toJSON();

    } else {
      requestObj.filterStartDate = undefined;
      requestObj.filterEndDate = undefined;
    }

    // write the api here to get filtercall list
    this._SupervisorCallTypeReportService.filterCallList(requestObj).subscribe(
      (response: Response) => this.data = this.successhandeler(response));
  }
  toUTCDate(date) {
    const _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(),
      date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return _utc;
  };

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  };
  successhandeler(response) {
    console.log(response, 'respinse call wala');
    if (response.length > 5) {
      this.showPaginationControls = true;
    }
    return response;
  }
  populateCallTypes(response: any) {
    this.calltypes = response.map(function (item) {
      return { 'callTypeDesc': item.callGroupType };
    });
  }
  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }
  getCallSubType(callType: any) {

    this.callSubTypes = this.callTypeObj.filter(function (item) {
      return item.callGroupType === callType;
    }).map(function (previousData, item) {
      return previousData.callTypes;
    })[0];
  }

}
