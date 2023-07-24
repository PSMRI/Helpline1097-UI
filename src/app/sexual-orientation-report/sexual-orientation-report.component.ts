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
import { NgForm } from "@angular/forms";
import { dataService } from "../services/dataService/data.service";
import { UserBeneficiaryData } from "../services/common/userbeneficiarydata.service";
import { ReportsService } from "../services/reports-service/reports-service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { LocationService } from "../services/common/location.service";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import * as XLSX from "xlsx";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
import * as moment from 'moment';
import { saveAs } from 'file-saver';


@Component({
  selector: "app-sexual-orientation-report",
  templateUrl: "./sexual-orientation-report.component.html",
  styleUrls: ["./sexual-orientation-report.component.css"],
})
export class SexualOrientationReportComponent implements OnInit {
  today: Date;
  start_date: Date;
  end_date: Date;
  maxStartDate: Date;
  maxEndDate: Date;
  tableFlag: boolean = false;
  data = [];
  sexualOrientations = [];
  providerServiceMapID: any;
  @ViewChild("sexualOrientationSearchForm") sexualOrientationSearchForm: NgForm;
  postData: any = [];
  orientations = [];
  states = [];
  districts = [];
  sexualOrientation: any;
  state: any;
  district: any;
  currentLanguageSet: any;

  constructor(
    private dataService: dataService,
    private userbeneficiarydata: UserBeneficiaryData,
    private reportsService: ReportsService,
    private alertService: ConfirmationDialogsService,
    private locationService: LocationService,
    public httpServices: HttpServices
  ) {}

  ngOnInit() {
    this.setTodayDate();
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.userbeneficiarydata
      .getUserBeneficaryData(this.providerServiceMapID)
      .subscribe(
        (response) => {
          console.log(response);
          this.sexualOrientations = response["sexualOrientations"];
          let all = {
            sexualOrientation: "All",
          };
          this.sexualOrientations.push(all);
          this.states = response["states"];
        },
        (error) => {
          this.alertService.alert(error.errorMessage, "error");

          console.log(error);
        }
      );

    this.providerServiceMapID = this.dataService.current_service.serviceID;
    //console.log("sd,ed,msd,med", this.start_date, this.end_date, this.maxStartDate, this.maxEndDate);
    //this.minStartDate.setMonth(this.minStartDate.getMonth()-1);
  }
  setTodayDate() {
    this.today = new Date();
    this.maxStartDate = new Date();
    this.maxStartDate.setDate(this.today.getDate() - 1);
    this.maxStartDate.setHours(0, 0, 0, 0);

    this.maxEndDate = new Date();
    this.maxEndDate.setDate(this.today.getDate() - 1);
    this.maxEndDate.setHours(23, 59, 59, 0);
  }
  blockKey(e: any) {
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
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  getDistricts() {
    this.districts = [];
    this.sexualOrientationSearchForm.form.patchValue({
      district: "",
    });
    this.locationService
      .getDistricts(this.sexualOrientationSearchForm.value.state.stateID)
      .subscribe(
        (response) => {
          this.districts = response;
        },
        (error) => {
          this.alertService.alert(error.errorMessage, "error");

          console.log(error);
        }
      );
    console.log(this.sexualOrientations);
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

      let startDate: Date = new Date( this.sexualOrientationSearchForm.value.startDate);
      let endDate: Date = new Date(this.sexualOrientationSearchForm.value.endDate);
  
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
        "beneficiarySexualOrientation": this.sexualOrientationSearchForm.value.sexuality == "All" ? null : this.sexualOrientationSearchForm.value.sexuality,
        "state": this.sexualOrientationSearchForm.value.state !== undefined ? this.sexualOrientationSearchForm.value.state.stateName : undefined,
        "district": (this.sexualOrientationSearchForm.value.district !== null && this.sexualOrientationSearchForm.value.district !== "" ) ? this.sexualOrientationSearchForm.value.district : undefined,
        "fileName": "Sexual_Orientation_Report"
      }
    
      this.reportsService.getAllBySexualOrientation(reqObj).subscribe((response) => {
        if (response) {
          saveAs(response,  reqObj.fileName+".xlsx");
          this.alertService.alert(this.currentLanguageSet.sexualOrientationReportDownloaded);
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
  download_report() {
    var head = Object.keys(this.orientations[0]);
    new Angular2Csv(this.orientations, "Sexual Orientation Report", {
      headers: head,
    });

    this.alertService.alert(
      this.currentLanguageSet.sexualOrientationReportDownloaded,
      "success"
    );
  }
  downloadV2() {
    let criteria: any = [];
    // let state = this.sexualOrientationSearchForm.value.state.stateName ? this.sexualOrientationSearchForm.value.state.stateName : 'Any';
    // let district = this.sexualOrientationSearchForm.value.district ? this.sexualOrientationSearchForm.value.district : 'Any';
    criteria.push({ Filter_Name: "State", value: this.state });
    criteria.push({ Filter_Name: "District", value: this.district });
    criteria.push({
      Filter_Name: "Sexual_Orientation",
      value: this.sexualOrientation,
    });
    criteria.push({ Filter_Name: "Start_Date", value: moment(this.start_date).format('DD-MM-YYYY') });
    criteria.push({ Filter_Name: "End_Date", value: moment(this.end_date).format('DD-MM-YYYY') });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    let headers = [
      "SlNo",
      "sexualOrientation",
      "serviceProvidedRatio",
      "count",
    ];
    let wb_name = "Sexual Orientation Report";
    const criteria_worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(criteria);
    const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.orientations,
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
    this.orientations = [];
    this.tableFlag = false;
  }
}
