import { Component, OnInit, ViewChild } from "@angular/core";
import { UserBeneficiaryData } from "../services/common/userbeneficiarydata.service";
import { dataService } from "../services/dataService/data.service";
import { LocationService } from "../services/common/location.service";
import { ReportsService } from "../services/reports-service/reports-service";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { NgForm } from "@angular/forms";
import * as XLSX from "xlsx";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
import { DoCheck } from "@angular/core";
import * as moment from 'moment';
import {saveAs} from 'file-saver';

@Component({
  selector: "app-caller-age-report",
  templateUrl: "./caller-age-report.component.html",
  styleUrls: ["./caller-age-report.component.css"],
})
export class CallerAgeReportComponent implements OnInit, DoCheck {
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

  @ViewChild("callerAgeSearchForm") callerAgeSearchForm: NgForm;
  assignSelectedLanguageValue: any;

  constructor(
    private _userBeneficiaryData: UserBeneficiaryData,
    private saved_data: dataService,
    private _locationService: LocationService,
    private reportService: ReportsService,
    private alertMessage: ConfirmationDialogsService,
    private httpServices: HttpServices
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    this.today = new Date();
    this.maxStartDate = new Date();
    this.maxStartDate.setDate(this.today.getDate() - 1);
    this.maxStartDate.setHours(0, 0, 0, 0);

    this.maxEndDate = new Date();
    this.maxEndDate.setDate(this.today.getDate() - 1);
    this.maxEndDate.setHours(23, 59, 59, 0);

    //call api and initialize data
    this._userBeneficiaryData
      .getUserBeneficaryData(this.saved_data.current_service.serviceID)
      .subscribe(
        (response) => {
          this.SetUserBeneficiaryRegistrationData(response);
        },
        (err) => {
          this.alertMessage.alert(err.errorMessage, "error");
        }
      );
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    this.ageGroups = [
      {
        ageGroupDisplay: "Below 15",
        ageGroupValue: {
          minAge: 0,
          maxAge: 15,
        },
      },
      {
        ageGroupDisplay: "15 to 24",
        ageGroupValue: {
          minAge: 15,
          maxAge: 24,
        },
      },
      {
        ageGroupDisplay: "25 to 39",
        ageGroupValue: {
          minAge: 25,
          maxAge: 39,
        },
      },
      {
        ageGroupDisplay: "40 to 59",
        ageGroupValue: {
          minAge: 40,
          maxAge: 59,
        },
      },
      {
        ageGroupDisplay: "Above 59",
        ageGroupValue: {
          minAge: 59,
          maxAge: 150,
        },
      },
      {
        ageGroupDisplay: "All",
        ageGroupValue: "All",
      },
    ];
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

    let startDate: Date = new Date( this.callerAgeSearchForm.value.startDate);
    let endDate: Date = new Date(this.callerAgeSearchForm.value.endDate);

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
      "maxAge": this.callerAgeSearchForm.value.ageGroup == "All" ? null : this.callerAgeSearchForm.value.ageGroup.maxAge,
      "minAge": this.callerAgeSearchForm.value.ageGroup == "All" ? null : this.callerAgeSearchForm.value.ageGroup.minAge,
      "callerAgeGroup": ((this.callerAgeSearchForm.value.ageGroup.minAge !== undefined && this.callerAgeSearchForm.value.ageGroup.minAge !== null) || (this.callerAgeSearchForm.value.ageGroup.maxAge !== undefined && this.callerAgeSearchForm.value.ageGroup.maxAge !== null)) ? this.callerAgeSearchForm.value.ageGroup.minAge + " to " + this.callerAgeSearchForm.value.ageGroup.maxAge : "All",
      "state": this.callerAgeSearchForm.value.state !== undefined ? this.callerAgeSearchForm.value.state.stateName : undefined,      
      "district": (this.callerAgeSearchForm.value.district !== null && this.callerAgeSearchForm.value.district !== "" ) ? this.callerAgeSearchForm.value.district : undefined,
      "fileName": "Caller_Age_Group_Report"
    }
  
    this.reportService.getAllByAgeGroup(reqObj).subscribe((response) => {
      if (response) {
        saveAs(response,  reqObj.fileName+".xlsx");
        this.alertMessage.alert(this.assignSelectedLanguageValue.callerAgeReportDownloaded);
      }else {
        this.alertMessage.alert(this.assignSelectedLanguageValue.noDataFound);
      }
    },
    (err) => {
      if(err.status === 500)
      {
        this.alertMessage.alert(this.assignSelectedLanguageValue.noDataFound, 'info');
      }
      else
      this.alertMessage.alert(this.assignSelectedLanguageValue.errorWhileFetchingReport, 'error');
    })

  }

  // getReports(value) {
  //   let noOfGroups = value.ageGroup.length;
  //   let array = [];
  //   let obj = {};
  //   let start_date =
  //     new Date(
  //       value.startDate - 1 * (value.startDate.getTimezoneOffset() * 60 * 1000)
  //     )
  //       .toJSON()
  //       .slice(0, 10) + "T00:00:00.000Z";
  //   let end_date =
  //     new Date(
  //       value.endDate - 1 * (value.endDate.getTimezoneOffset() * 60 * 1000)
  //     )
  //       .toJSON()
  //       .slice(0, 10) + "T23:59:59.999Z";
  //   let state;
  //   if (this.state) {
  //     state = this.state.stateName;
  //   }
  //   // else {
  //   //   state = "";
  //   // }
  //   let district = undefined;
  //   if (this.district) {
  //     district = this.district;
  //   }

  //   if (this.ageGroup == "All") {
  //     for (let i = 0; i < this.ageGroups.length - 1; i++) {
  //       obj = {
  //         providerServiceMapID: this.providerServiceMapID,
  //         maxAge: this.ageGroups[i].ageGroupValue.maxAge,
  //         minAge: this.ageGroups[i].ageGroupValue.minAge,
  //         startTimestamp: start_date,
  //         endTimestamp: end_date,
  //         state: state,
  //         //"beneficiaryDistrict": value.district ? value.district : ""
  //         district: district,
  //       };
  //       array.push(obj);
  //     }
  //   } else {
  //     obj = {
  //       providerServiceMapID: this.providerServiceMapID,
  //       maxAge: value.ageGroup.maxAge,
  //       minAge: value.ageGroup.minAge,
  //       startTimestamp: start_date,
  //       endTimestamp: end_date,
  //       state: state,
  //       //"beneficiaryDistrict": value.district ? value.district : ""
  //       district: district,
  //     };
  //     array.push(obj);
  //   }
  //   this.start_date = value.startDate;
  //   this.end_date = value.endDate;
  //   this.stateName = state;
  //   this.district = district;

  //   console.log(array);
  //   this.reportService.getAllByAgeGroup(array).subscribe(
  //     (response) => {
  //       this.reportSuccessHandle(response);
  //     },
  //     (err) => {
  //       this.alertMessage.alert(err.errorMessage, "error");
  //     }
  //   );
  // }
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
      this._locationService.getDistricts(state.stateID).subscribe(
        (response) => this.SetDistricts(response),
        (err) => {
          this.alertMessage.alert(err.errorMessage, "error");
        }
      );
    }
  }
  SetDistricts(response: any) {
    this.districts = response;
  }
  download() {
    var options = {
      showLabels: true,
      showTitle: true,
    };

    let head = Object.keys(this.count[0]);
    console.log(head);
    new Angular2Csv(this.count, "AgeGroup Report", { headers: head });
    this.alertMessage.alert("AgeGroup report downloaded", "success");
  }
  downloadV2() {
    let criteria: any = [];
    let state = this.state
      ? this.state.stateName
        ? this.state.stateName
        : "Any"
      : "Any";
    let district = this.district ? this.district : "Any";
    criteria.push({ Filter_Name: "State", value: state });
    criteria.push({ Filter_Name: "District", value: district });
    criteria.push({ Filter_Name: "Caller_Age_Group", value: this.ageGroup });
    criteria.push({ Filter_Name: "Start_Date", value: moment(this.start_date).format('DD-MM-YYYY')});
    criteria.push({ Filter_Name: "End_Date", value: moment(this.end_date).format('DD-MM-YYYY') });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    let headers = [
      "SlNo",
      "groupName",
      "minAge",
      "maxAge",
      "serviceProvidedRatio",
      "count",
    ];
    let wb_name = "Caller Age Group Report";
    const criteria_worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(criteria);
    const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.count,
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
    this.count = [];
    this.tableFlag = false;
  }
  /*
   * JA354063 - Created on 29-07-2021
   */
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.assignSelectedLanguageValue = getLanguageJson.currentLanguageObject;
  }
}
