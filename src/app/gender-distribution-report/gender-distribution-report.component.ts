/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { Component, OnInit, ViewChild } from "@angular/core";
import { dataService } from "../services/dataService/data.service";
import { UserBeneficiaryData } from "../services/common/userbeneficiarydata.service";
import { ReportsService } from "../services/reports-service/reports-service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { LocationService } from "../services/common/location.service";
import { NgForm } from "@angular/forms";

import { Angular2Csv } from "angular2-csv/Angular2-csv";
import * as XLSX from "xlsx";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
import * as moment from 'moment';
import {saveAs} from 'file-saver';

@Component({
  selector: "app-gender-distribution-report",
  templateUrl: "./gender-distribution-report.component.html",
  styleUrls: ["./gender-distribution-report.component.css"],
})
export class GenderDistributionReportComponent implements OnInit {
  today: Date;
  start_date: Date;
  end_date: Date;
  minStartDate: Date;
  tableFlag: boolean = false;

  genders = [];
  gender: any;
  providerServiceMapID: any;
  maxStartDate: Date;
  request_obj: any;
  request_array: any = [];
  maxEndDate: Date;
  states: any = [];
  districts: any = [];
  state: any;
  district: any;
  gender_distribution_resultset: any = [];
  @ViewChild("genderDistributionSearchForm")
  genderDistributionSearchForm: NgForm;
  currentLanguageSet: any;

  constructor(
    private dataService: dataService,
    private userbeneficiarydata: UserBeneficiaryData,
    private reportsService: ReportsService,
    private alertService: ConfirmationDialogsService,
    private _locationService: LocationService,
    private HttpServices: HttpServices
  ) {}

  ngOnInit() {
    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.userbeneficiarydata
      .getUserBeneficaryData(this.providerServiceMapID)
      .subscribe((response) => {
        console.log(response);
        this.genders = response["m_genders"];
        let all = {
          genderName: "All",
        };
        this.genders.push(all);
        if (response.states) {
          this.states = response.states;
        }
      }),
      (err) => {
        this.alertService.alert(err.errorMessage);
      };
    this.today = new Date();
    this.maxStartDate = new Date();
    this.maxStartDate.setDate(this.today.getDate() - 1);
    this.maxStartDate.setHours(0, 0, 0, 0);

    this.maxEndDate = new Date();
    this.maxEndDate.setDate(this.today.getDate() - 1);
    this.maxEndDate.setHours(23, 59, 59, 0);

    this.request_obj = {
      startTimestamp: "",
      endTimestamp: "",
    };
    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.assignSelectedLanguage();
  }

  GetDistricts(state) {
    this.districts = [];
    this.district = undefined;
    if (state) {
      this._locationService.getDistricts(state.stateID).subscribe(
        (response) => this.SetDistricts(response),
        (err) => {
          this.alertService.alert(err.errorMessage);
        }
      );
    }
  }

  SetDistricts(response: any) {
    this.districts = response;
  }

  blockKey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  endDateChange() {
    const timeDiff = this.maxEndDate.getTime() - this.start_date.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays >= 0) {
      if (diffDays > 31) {
        this.maxEndDate = new Date(this.start_date);
        this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
        this.maxEndDate.setHours(23, 59, 59, 0);
        this.end_date = this.maxEndDate;
      }
      if (diffDays <= 31) {
        this.checkForEndDateDifference();
      }
    } else {
      this.checkForEndDateDifference();
    }
  }
  checkForEndDateDifference() {
    const endDateDiff = this.today.getTime() - this.start_date.getTime();
    const enddiffDays = Math.ceil(endDateDiff / (1000 * 3600 * 24));
    if (enddiffDays > 31) {
      this.maxEndDate = new Date(this.start_date);
      this.maxEndDate.setDate(this.maxEndDate.getDate() + 30);
      this.maxEndDate.setHours(23, 59, 59, 0);
      this.end_date = this.maxEndDate;
    } else {
      this.maxEndDate = new Date();
      this.maxEndDate.setDate(this.today.getDate() - 1);
      this.maxEndDate.setHours(23, 59, 59, 0);
      this.end_date = this.maxEndDate;
    }
  }
  getReports() {

    let startDate: Date = new Date( this.genderDistributionSearchForm.value.startDate);
    let endDate: Date = new Date(this.genderDistributionSearchForm.value.endDate);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);


    let reqObj = {
      "startTimestamp": new Date(startDate.valueOf() - 1 * startDate.getTimezoneOffset() * 60 * 1000),
      "endTimestamp": new Date(endDate.valueOf() - 1 * endDate.getTimezoneOffset() * 60 * 1000),
      "providerServiceMapID": this.providerServiceMapID,
      "gender": this.genderDistributionSearchForm.value.gender == "All" ? null : this.genderDistributionSearchForm.value.gender,
      "state": this.genderDistributionSearchForm.value.state !== undefined ? this.genderDistributionSearchForm.value.state.stateName : undefined,
      "district": (this.genderDistributionSearchForm.value.district !== null && this.genderDistributionSearchForm.value.district !== "" ) ? this.genderDistributionSearchForm.value.district : undefined,
      "fileName": "Gender_Distribution_Report"
    }
  
    this.reportsService.getAllByGender(reqObj).subscribe((response) => {
      if (response) {
        saveAs(response,  reqObj.fileName+".xlsx");
        this.alertService.alert(this.currentLanguageSet.genderDistributionReportDownloaded);
      }else {
        this.alertService.alert(this.currentLanguageSet.noDataFound);
      }
    },
    (err) => {
      if(err.status === 500)
      {
        this.alertService.alert(this.currentLanguageSet.noDataFound, 'info');
      }
      else
      this.alertService.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
    })

  }
  // getReports(form_values) {
  //   //call api and initialize data
  //   this.request_array = [];
  //   console.log(form_values.gender, "GENDER ARRAY CONDITION");
  //   if (form_values.gender == "All") {
  //     for (let i = 0; i < this.genders.length - 1; i++) {
  //       var obj = Object.assign({}, this.request_obj);
  //       obj["gender"] = this.genders[i].genderName;
  //       obj["providerServiceMapID"] = this.providerServiceMapID;

  //       obj["startTimestamp"] =
  //         new Date(
  //           form_values.startDate -
  //             1 * (form_values.startDate.getTimezoneOffset() * 60 * 1000)
  //         )
  //           .toJSON()
  //           .slice(0, 10) + "T00:00:00.000Z";

  //       obj["endTimestamp"] =
  //         new Date(
  //           form_values.endDate -
  //             1 * (form_values.endDate.getTimezoneOffset() * 60 * 1000)
  //         )
  //           .toJSON()
  //           .slice(0, 10) + "T23:59:59.999Z";

  //       if (form_values.state) {
  //         obj["state"] = form_values.state.stateName;
  //       }

  //       if (form_values.district) {
  //         obj["district"] = form_values.district;
  //       }

  //       this.request_array.push(obj);
  //     }
  //     console.log("request array", this.request_array);
  //   } else {
  //     /*assign all genders if no gender was selected*/
  //     // for(let i=0;i<form_values.gender.length;i++)
  //     // {
  //     /*selected genders*/
  //     var obj = Object.assign({}, this.request_obj);
  //     obj["gender"] = form_values.gender;
  //     obj["providerServiceMapID"] = this.providerServiceMapID;
  //     obj["startTimestamp"] =
  //       new Date(
  //         form_values.startDate -
  //           1 * (form_values.startDate.getTimezoneOffset() * 60 * 1000)
  //       )
  //         .toJSON()
  //         .slice(0, 10) + "T00:00:00.000Z";

  //     obj["endTimestamp"] =
  //       new Date(
  //         form_values.endDate -
  //           1 * (form_values.endDate.getTimezoneOffset() * 60 * 1000)
  //       )
  //         .toJSON()
  //         .slice(0, 10) + "T23:59:59.999Z";

  //     if (form_values.state) {
  //       obj["state"] = form_values.state.stateName;
  //     }

  //     if (form_values.district) {
  //       obj["district"] = form_values.district;
  //     }

  //     this.request_array.push(obj);
  //     // }

  //     console.log("request array", this.request_array);
  //   }

  //   // this.start_date = form_values.start_date;
  //   // this.end_date = form_values.end_date;
  //   this.gender = form_values.gender;
  //   // this.state = form_values.state.stateName;
  //   //this.district = form_values.district;
  //   if (form_values.state == undefined) {
  //     this.state = form_values.state ? form_values.state.stateName : "Any";
  //   }
  //   this.reportsService.getAllByGender(this.request_array).subscribe(
  //     (response) => this.getReportSuccessHandeler(response),
  //     (err) => {
  //       this.alertService.alert(err.errorMessage);
  //     }
  //   );
  // }

  getReportSuccessHandeler(response) {
    if (response) {
      this.tableFlag = true;
      console.log(response, "REPORT SUCCESS");
      this.gender_distribution_resultset = response;
    } else {
      this.alertService.alert(response.status, "error");
    }
  }

  download_report() {
    var head = Object.keys(this.gender_distribution_resultset[0]);
    new Angular2Csv(
      this.gender_distribution_resultset,
      "Gender Distribution Report",
      { headers: head }
    );
    this.alertService.alert(
      this.currentLanguageSet.genderDistributionReportDownloaded,
      "success"
    );
  }
  downloadV2(form_values) {
    let criteria: any = [];
    let state: any;
    // let state = (this.state ? (this.state.stateName ? this.state.stateName : 'Any') : 'Any');
    // let district = this.district ? this.district : 'Any';
    if (form_values.state === "Any") {
      state = form_values.state ? form_values.state : "Any";
    } else {
      state = form_values.state ? form_values.state.stateName : "Any";
    }
    this.district = form_values.district ? form_values.district : "Any";
    criteria.push({ Filter_Name: "State", value: state });
    criteria.push({ Filter_Name: "District", value: this.district });
    criteria.push({ Filter_Name: "Gender", value: this.gender });
    criteria.push({ Filter_Name: "Start_Date", value: moment(this.start_date).format('DD-MM-YYYY') });
    criteria.push({ Filter_Name: "End_Date", value: moment(this.end_date).format('DD-MM-YYYY') });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    let headers = ["SlNo", "gender", "serviceProvidedRatio", "count"];
    let wb_name = "Gender Distribution Report";
    const criteria_worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(criteria);
    const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.gender_distribution_resultset,
      { header: headers }
    );

    // below code added to modify the headers ---XXXXXXXXXXXXXX----- 5/7/18 gursimran

    let i = 65; // starting from 65 since it is the ASCII code of 'A'.
    let count = 0;
    while (i < headers.length + 65) {
      let j;
      if (count > 0) {
        j = i - 26 * count;
      } else {
        j = i;
      }
      let cellPosition = String.fromCharCode(j);
      let finalCellName: any;
      if (count == 0) {
        finalCellName = cellPosition + "1";
        // console.log(finalCellName);
      } else {
        let newcellPosition = String.fromCharCode(64 + count);
        finalCellName = newcellPosition + cellPosition + "1";
        // console.log(finalCellName);
      }
      let newName = this.modifyHeader(headers, i);
      delete report_worksheet[finalCellName].w;
      report_worksheet[finalCellName].v = newName;
      i++;
      if (i == 91 + count * 26) {
        // i = 65;
        count++;
      }
    }
    // --------end--------

    const workbook: XLSX.WorkBook = {
      Sheets: { Report: report_worksheet, Criteria: criteria_worksheet },
      SheetNames: ["Criteria", "Report"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    let blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, wb_name);
    } else {
      var link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("visibility", "hidden");
      link.download = wb_name.replace(/ /g, "_") + ".xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  modifyHeader(headers, i) {
    let modifiedHeader: String;
    modifiedHeader = headers[i - 65]
      .toString()
      .replace(/([A-Z])/g, " $1")
      .trim();
    modifiedHeader =
      modifiedHeader.charAt(0).toUpperCase() + modifiedHeader.substr(1);
    //console.log(modifiedHeader);
    return modifiedHeader.replace(/I D/g, "ID");
  }
  resetWorklist() {
    this.gender_distribution_resultset = [];
    this.tableFlag = false;
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
}
