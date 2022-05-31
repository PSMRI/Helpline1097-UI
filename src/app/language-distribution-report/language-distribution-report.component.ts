import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { dataService } from "../services/dataService/data.service";
import { UserBeneficiaryData } from "../services/common/userbeneficiarydata.service";
import { ReportsService } from "../services/reports-service/reports-service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { LocationService } from "../services/common/location.service";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import * as XLSX from "xlsx";
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from "app/set-language.component";
import * as moment from 'moment';
import { saveAs } from 'file-saver';

@Component({
  selector: "app-language-distribution-report",
  templateUrl: "./language-distribution-report.component.html",
  styleUrls: ["./language-distribution-report.component.css"],
})
export class LanguageDistributionReportComponent implements OnInit {
  today: Date;
  start_date: Date;
  end_date: Date;
  minStartDate: Date;
  tableFlag: boolean = false;
  data = [];
  languages = [];
  providerServiceMapID: any;
  languageDistributions = [];
  postData = [];
  states = [];
  districts = [];
  maxStartDate: Date;
  maxEndDate: Date;
  state: any;
  district: any;
  language: any;

  @ViewChild("languageDistributionSearchForm")
  languageDistributionSearchForm: NgForm;
  currentLanguageSet: any;

  constructor(
    private dataService: dataService,
    private userbeneficiarydata: UserBeneficiaryData,
    private locationService: LocationService,
    private alertService: ConfirmationDialogsService,
    private reportsService: ReportsService,
    public HttpServices: HttpServices
  ) {}

  ngOnInit() {
    this.setTodayDate();
    this.assignSelectedLanguage();
    this.providerServiceMapID = this.dataService.current_service.serviceID;
    this.userbeneficiarydata
      .getUserBeneficaryData(this.providerServiceMapID)
      .subscribe((response) => {
        console.log(response);
        this.languages = response["m_language"];
        let all = {
          languageName: "All",
        };
        this.languages.push(all);
        this.states = response["states"];
      }),
      (err) => this.alertService.alert(err.errorMessage);
    this.providerServiceMapID = this.dataService.current_service.serviceID;
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
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  blockKey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  getDistricts() {
    this.districts = [];
    this.languageDistributionSearchForm.form.patchValue({
      district: "",
    });
    this.locationService
      .getDistricts(this.languageDistributionSearchForm.value.state.stateID)
      .subscribe(
        (response) => {
          this.districts = response;
        },
        (error) => {
          this.alertService.alert(error.errorMessage);
          console.log(error);
        }
      );
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
  // getReportsOld() {
  //   console.log("values:", this.languageDistributionSearchForm.value);
  //   this.postData = [];
  //   if (this.languageDistributionSearchForm.value.language == "All") {
  //     for (var i = 0; i < this.languages.length - 1; i++) {
  //       var obj = {
  //         providerServiceMapID: this.providerServiceMapID,

  //         startTimestamp:
  //           new Date(
  //             this.languageDistributionSearchForm.value.startDate.getTime() -
  //               1 *
  //                 (this.languageDistributionSearchForm.value.startDate.getTimezoneOffset() *
  //                   60 *
  //                   1000)
  //           )
  //             .toJSON()
  //             .slice(0, 10) + "T00:00:00.000Z",
  //         endTimestamp:
  //           new Date(
  //             this.languageDistributionSearchForm.value.endDate.getTime() -
  //               1 *
  //                 (this.languageDistributionSearchForm.value.endDate.getTimezoneOffset() *
  //                   60 *
  //                   1000)
  //           )
  //             .toJSON()
  //             .slice(0, 10) + "T23:59:59.999Z",
  //         beneficiaryPreferredLanguage: this.languages[i].languageName,
  //       };
  //       if (this.languageDistributionSearchForm.value.state != "") {
  //         obj["state"] =
  //           this.languageDistributionSearchForm.value.state.stateName;
  //       }
  //       if (this.languageDistributionSearchForm.value.district != "") {
  //         obj["district"] = this.languageDistributionSearchForm.value.district;
  //       }
  //       this.postData.push(obj);
  //     }
  //   } else {
  //     //  for(var i=0; i< this.languageDistributionSearchForm.value.language.length;i++){
  //     var obj = {
  //       providerServiceMapID: this.providerServiceMapID,

  //       startTimestamp:
  //         new Date(
  //           this.languageDistributionSearchForm.value.startDate.getTime() -
  //             1 *
  //               (this.languageDistributionSearchForm.value.startDate.getTimezoneOffset() *
  //                 60 *
  //                 1000)
  //         )
  //           .toJSON()
  //           .slice(0, 10) + "T00:00:00.000Z",
  //       endTimestamp:
  //         new Date(
  //           this.languageDistributionSearchForm.value.endDate.getTime() -
  //             1 *
  //               (this.languageDistributionSearchForm.value.endDate.getTimezoneOffset() *
  //                 60 *
  //                 1000)
  //         )
  //           .toJSON()
  //           .slice(0, 10) + "T23:59:59.999Z",
  //       beneficiaryPreferredLanguage:
  //         this.languageDistributionSearchForm.value.language,
  //     };
  //     if (this.languageDistributionSearchForm.value.state != "") {
  //       obj["state"] =
  //         this.languageDistributionSearchForm.value.state.stateName;
  //     }
  //     if (this.languageDistributionSearchForm.value.district != "") {
  //       obj["district"] = this.languageDistributionSearchForm.value.district;
  //     }
  //     this.postData.push(obj);
  //     //   }
  //   }

  //   this.language = this.languageDistributionSearchForm.value.language;
  //   this.state = this.languageDistributionSearchForm.value.state.stateName
  //     ? this.languageDistributionSearchForm.value.state.stateName
  //     : "Any";
  //   this.district = this.languageDistributionSearchForm.value.district
  //     ? this.languageDistributionSearchForm.value.district
  //     : "Any";
  //   // this.start_date = this.sexualOrientationSearchForm.value.startDate;
  //   // this.end_date = this.sexualOrientationSearchForm.value.endDate;
  //   console.log(this.postData);
  //   this.reportsService.getCountsByPreferredLanguage(this.postData).subscribe(
  //     (response) => {
  //       console.log(response);
  //       this.tableFlag = true;
  //       this.languageDistributions = response;
  //     },
  //     (error) => {
  //       this.alertService.alert(error.errorMessage);
  //       console.log(error);
  //     }
  //   );
  // }

  getReports() {

    let startDate: Date = new Date( this.languageDistributionSearchForm.value.startDate);
    let endDate: Date = new Date(this.languageDistributionSearchForm.value.endDate);

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
      "beneficiaryPreferredLanguage": this.languageDistributionSearchForm.value.language == "All" ? null : this.languageDistributionSearchForm.value.language,
      "state": this.languageDistributionSearchForm.value.state !== undefined ? this.languageDistributionSearchForm.value.state.stateName : undefined,
      "district": (this.languageDistributionSearchForm.value.district !== null && this.languageDistributionSearchForm.value.district !== "" ) ? this.languageDistributionSearchForm.value.district : undefined,
      "fileName": "Language_Distribution_Report"
    }
  
    this.reportsService.getCountsByPreferredLanguage(reqObj).subscribe((response) => {
      if (response) {
        saveAs(response,  reqObj.fileName+".xlsx");
        this.alertService.alert(this.currentLanguageSet.languageDistributionReportDownloaded);
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
  download() {
    var options = {
      showLabels: true,
      showTitle: true,
    };

    let head = Object.keys(this.languageDistributions[0]);
    // console.log(head);
    new Angular2Csv(
      this.languageDistributions,
      "LanguageDistributions Report",
      { headers: head }
    );
    this.alertService.alert(
      this.currentLanguageSet.languageDistributionReportDownloaded,
      "success"
    );
  }
  downloadV2() {
    let criteria: any = [];
    // let state = (this.state ? (this.state.stateName ? this.state.stateName : 'Any') : 'Any');
    // let district = this.district ? this.district : 'Any';
    criteria.push({ Filter_Name: "State", value: this.state });
    criteria.push({ Filter_Name: "District", value: this.district });
    criteria.push({ Filter_Name: "Language", value: this.language });
    criteria.push({ Filter_Name: "Start_Date", value: moment(this.start_date).format('DD-MM-YYYY') });
    criteria.push({ Filter_Name: "End_Date", value: moment(this.end_date).format('DD-MM-YYYY') });
    this.exportToxlsx(criteria);
  }
  exportToxlsx(criteria: any) {
    let headers = [
      "SlNo",
      "preferredLanguage",
      "serviceProvidedRatio",
      "count",
    ];
    let wb_name = "Language Distribution Report";
    const criteria_worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(criteria);
    const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.languageDistributions,
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
    this.languageDistributions = [];
    this.tableFlag = false;
  }
}
