import { Component, OnInit, ViewChild } from '@angular/core';
import { UserBeneficiaryData } from '../services/common/userbeneficiarydata.service'
import { dataService } from '../services/dataService/data.service';
import { LocationService } from '../services/common/location.service';
import { ReportsService } from '../services/reports-service/reports-service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-caller-age-report',
  templateUrl: './caller-age-report.component.html',
  styleUrls: ['./caller-age-report.component.css']
})
export class CallerAgeReportComponent implements OnInit {

  today: Date;
  start_date: Date;
  end_date: Date;
  minStartDate: Date;
  tableFlag: boolean = false;
  data = {};
  states = [];
  state: any;
  stateName: any;
  districts = [];
  district: any;
  ageGroup: any;
  ageGroups = [];
  providerServiceMapID: any;
  maxStartDate: Date;
  maxEndDate: Date;

  @ViewChild('callerAgeSearchForm') callerAgeSearchForm: NgForm;

  constructor(private _userBeneficiaryData: UserBeneficiaryData, private saved_data: dataService,
    private _locationService: LocationService, private reportService: ReportsService,
    private alertMessage: ConfirmationDialogsService) { }

  ngOnInit() {
    // this.today = new Date();
    // console.log(this.today);
    // this.end_date = new Date();
    // this.end_date.setDate(this.today.getDate() - 1);
    // this.start_date = new Date();
    // this.start_date.setDate(this.today.getDate() - 7);
    // this.minStartDate = new Date();
    // this.minStartDate.setMonth(this.minStartDate.getMonth() - 1);

    this.today = new Date();
    this.end_date = new Date();
    this.end_date.setDate(this.today.getDate() - 1);
    this.end_date.setHours(23, 59, 59, 0);

    this.start_date = new Date();
    this.start_date.setDate(this.today.getDate() - 7);
    this.start_date.setHours(0, 0, 0, 0);

    this.maxStartDate = new Date();
    this.maxStartDate.setDate(this.today.getDate() - 1);
    this.maxStartDate.setHours(0, 0, 0, 0);

    this.maxEndDate = new Date();
    this.maxEndDate.setDate(this.today.getDate() - 1);
    this.maxEndDate.setHours(23, 59, 59, 0);

    //call api and initialize data
    this._userBeneficiaryData.getUserBeneficaryData(this.saved_data.current_service.serviceID)
      .subscribe((response) => {
        this.SetUserBeneficiaryRegistrationData(response)
      },
      (err) => {
        this.alertMessage.alert(err.errorMessage, 'error');

      });
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.ageGroups = [
      {
        "ageGroupDisplay": "Below 15",
        "ageGroupValue": {
          "minAge": 0,
          "maxAge": 15
        }
      },
      {
        "ageGroupDisplay": "15 to 24",
        "ageGroupValue": {
          "minAge": 15,
          "maxAge": 24
        }
      },
      {
        "ageGroupDisplay": "24 to 39",
        "ageGroupValue": {
          "minAge": 24,
          "maxAge": 39
        }
      },
      {
        "ageGroupDisplay": "40 to 59",
        "ageGroupValue": {
          "minAge": 40,
          "maxAge": 59
        }
      },
      {
        "ageGroupDisplay": "Above 59",
        "ageGroupValue": {
          "minAge": 59
        }
      },
      {
        "ageGroupDisplay": "All",
        "ageGroupValue": "All"
      }

    ]
  }

  blockKey(e: any) {
    if (e.keyCode === 9) {
      return true;
    }
    else {
      return false;
    }
  }

  endDateChange() {

    //console.log("sd,med", this.start_date, this.maxEndDate);
    if (this.today.getTime() < this.maxEndDate.getTime()) {
      let i = new Date();
      i.setDate(this.today.getDate() - 1);
      this.maxEndDate = i;
      this.maxEndDate.setHours(23, 59, 59, 0);
      //console.log("sd,med", this.start_date, this.maxEndDate);
    }
    else {
      this.maxEndDate = new Date(this.start_date);
      this.maxEndDate.setMonth(this.maxEndDate.getMonth() + 1);
      this.maxEndDate.setHours(23, 59, 59, 0);
    }

    var timeDiff = this.end_date.getTime() - this.start_date.getTime();
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 90) {
      var tempDate = new Date(this.start_date);
      tempDate.setMonth(this.start_date.getMonth() + 1);
      tempDate.setHours(23, 59, 59, 0);
      this.callerAgeSearchForm.form.patchValue({
        'endDate': tempDate
      });
    }
    if (diffDays < 0) {
      var tempDate = new Date(this.start_date);
      tempDate.setHours(23, 59, 59, 0);
      this.callerAgeSearchForm.form.patchValue({
        'endDate': tempDate
      });
    }
  }// 1Dec by Gursimran

  getReports(value) {
    let noOfGroups = value.ageGroup.length;
    let array = [];
    let obj = {};
    let start_date = new Date((value.startDate) - 1 * (value.startDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T00:00:00.000Z";
    let end_date = new Date((value.endDate) - 1 * (value.endDate.getTimezoneOffset() * 60 * 1000)).toJSON().slice(0, 10) + "T23:59:59.999Z";
    let state;
    if (this.state) {

      state = this.state.stateName;
    }
    // else {
    //   state = "";
    // }
    let district = undefined
    if (this.district) {
      district = this.district;
    }

    if (this.ageGroup == "All") {
      for (let i = 0; i < this.ageGroups.length - 1; i++) {
        obj = {
          "providerServiceMapID": this.providerServiceMapID,
          "maxAge": this.ageGroups[i].ageGroupValue.maxAge,
          "minAge": this.ageGroups[i].ageGroupValue.minAge,
          "startTimestamp": start_date,
          "endTimestamp": end_date,
          "state": state,
          //"beneficiaryDistrict": value.district ? value.district : ""
          "district": district
        }
        array.push(obj);
      }
    }
    else {
      obj = {
        "providerServiceMapID": this.providerServiceMapID,
        "maxAge": value.ageGroup.maxAge,
        "minAge": value.ageGroup.minAge,
        "startTimestamp": start_date,
        "endTimestamp": end_date,
        "state": state,
        //"beneficiaryDistrict": value.district ? value.district : ""
        "district": district
      }
      array.push(obj);
    }
    this.start_date = value.startDate;
    this.end_date = value.endDate;
    this.stateName = state;
    this.district = district;


    console.log(array);
    this.reportService.getAllByAgeGroup(array).subscribe((response) => { this.reportSuccessHandle(response) }, (err) => {
      this.alertMessage.alert(err.errorMessage, 'error');

    });
  }
  count = [];
  reportSuccessHandle(res) {
    console.log(res);
    this.tableFlag = true;
    this.count = res;
  }
  SetUserBeneficiaryRegistrationData(response) {
    const regData = response;
    if (regData.states) {
      this.states = regData.states;
    }
  }
  GetDistricts(state: any) {
    this.districts = [];
    this.district = undefined;
    if (state) {
      this._locationService.getDistricts(state.stateID)
        .subscribe((response) => this.SetDistricts(response), (err) => {
          this.alertMessage.alert(err.errorMessage, 'error');

        });
    }
  }
  SetDistricts(response: any) {
    this.districts = response;
  }
  download() {
    var options = {

      showLabels: true,
      showTitle: true

    };

    let head = Object.keys(this.count[0]);
    console.log(head);
    new Angular2Csv(this.count, 'AgeGroup Report', { headers: (head) });
    this.alertMessage.alert('AgeGroup report downloaded', 'success');

  }
  downloadV2() {
    let criteria: any = [];
    let state = this.state ? (this.state.stateName ? this.state.stateName : 'Any') : 'Any';
    let district = this.district ? this.district : 'Any';
    criteria.push({ 'Filter_Name': 'State', 'value': state });
    criteria.push({ 'Filter_Name': 'District', 'value': district });
    criteria.push({ 'Filter_Name': 'Caller_Age_Group', 'value': this.ageGroup });
    criteria.push({ 'Filter_Name': 'Start_Date', 'value': this.start_date });
    criteria.push({ 'Filter_Name': 'End_Date', 'value': this.end_date });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    let headers = ["SlNo", "groupName", "minAge", "maxAge", "serviceProvidedRatio", "count"];
    let wb_name = "Caller Age Group Report";
    const criteria_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(criteria);
    const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.count, { header: headers });

    // below code added to modify the headers ---XXXXXXXXXXXXXX----- 5/7/18 gursimran

    let i = 65;    // starting from 65 since it is the ASCII code of 'A'.
    let count = 0;
    while (i < headers.length + 65) {
      let j;
      if (count > 0) {
        j = i - (26 * count);
      }
      else {
        j = i;
      }
      let cellPosition = String.fromCharCode(j);
      let finalCellName: any;
      if (count == 0) {
        finalCellName = cellPosition + "1";
        // console.log(finalCellName);
      }
      else {
        let newcellPosition = String.fromCharCode(64 + count);
        finalCellName = newcellPosition + cellPosition + "1";
        // console.log(finalCellName);
      }
      let newName = this.modifyHeader(headers, i);
      delete report_worksheet[finalCellName].w; report_worksheet[finalCellName].v = newName;
      i++;
      if (i == 91 + (count * 26)) {
        // i = 65;
        count++;
      }
    }
    // --------end--------

    const workbook: XLSX.WorkBook = { Sheets: { 'Report': report_worksheet, 'Criteria': criteria_worksheet }, SheetNames: ['Criteria', 'Report'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: "array" });
    let blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, wb_name);
    }
    else {
      var link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute('visibility', 'hidden');
      link.download = wb_name.replace(/ /g, "_") + ".xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  modifyHeader(headers, i) {
    let modifiedHeader: String;
    modifiedHeader = headers[i - 65].toString().replace(/([A-Z])/g, ' $1').trim();
    modifiedHeader = modifiedHeader.charAt(0).toUpperCase() + modifiedHeader.substr(1);
    //console.log(modifiedHeader);
    return modifiedHeader.replace(/I D/g, "ID");
  }
}
