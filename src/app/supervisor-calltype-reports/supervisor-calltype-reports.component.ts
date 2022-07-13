import { Component, OnInit, ViewChild } from "@angular/core";
import { SupervisorCallTypeReportService } from "../services/supervisorServices/supervisor-calltype-reports-service.service";
import { dataService } from "../services/dataService/data.service";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { UserBeneficiaryData } from "../services/common/userbeneficiarydata.service";
import { LocationService } from "../services/common/location.service";
import { ReportsService } from "../services/reports-service/reports-service";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { NgForm } from "@angular/forms";
import * as XLSX from "xlsx";
import { SetLanguageComponent } from "app/set-language.component";
import { HttpServices } from "app/services/http-services/http_services.service";
import * as moment from 'moment';
import { saveAs } from 'file-saver';

@Component({
  selector: "app-supervisor-calltype-reports",
  templateUrl: "./supervisor-calltype-reports.component.html",
  styleUrls: ["./supervisor-calltype-reports.component.css"],
})
export class SupervisorCalltypeReportsComponent implements OnInit {
  // ngmodels
  maxDate: Date;
  today: Date;

  callType: any;
  start_date: Date;
  end_date: Date;
  callTypeID: any;
  // arrays
  callsubTypeID: any;
  calltypes: any;
  callTypeObj: any;
  data: any;
  callSubTypes: any;
  // flags
  gender: any;
  genders = [];
  providerServiceMapID: any;
  minStartDate: any;
  tableFlag: boolean;
  showPaginationControls: boolean;
  sexuality: any;
  state: any;
  states = [];
  district: any;
  districts = [];
  sexualOrientations = [];
  language: any;
  languages = [];
  callTypeName: any;
  maxStartDate: Date;
  maxEndDate: Date;
  @ViewChild("CallTypeReport") CallTypeReport: NgForm;
  currentLanguageSet: any;

  constructor(
    public _SupervisorCallTypeReportService: SupervisorCallTypeReportService,
    private reportService: ReportsService,
    public commonDataService: dataService,
    private alertMessage: ConfirmationDialogsService,
    private _userBeneficiaryData: UserBeneficiaryData,
    private _locationService: LocationService,
    public httpServices: HttpServices
  ) {
    this.tableFlag = false;
    this.today = new Date();
    this.data = [];
  }

  ngOnInit() {
    this.setTodayDate();
    this.assignSelectedLanguage();
    let requestObject = {
      providerServiceMapID: this.commonDataService.current_service.serviceID,
    };
    this._SupervisorCallTypeReportService
      .getCallTypes(requestObject)
      .subscribe((response: Response) => {
        this.callTypeObj = response;
        this.populateCallTypes(response);
      }),
      (err) => {
        this.alertMessage.alert(err.errorMessage, "error");
      };

    this.providerServiceMapID =
      this.commonDataService.current_service.serviceID;
    this._userBeneficiaryData
      .getUserBeneficaryData(this.providerServiceMapID)
      .subscribe(
        (response) => {
          console.log(response);
          this.sexualOrientations = response["sexualOrientations"];
          this.states = response["states"];
          this.genders = response["m_genders"];
          this.languages = response["m_language"];
        },
        (error) => {
          this.alertMessage.alert(error.errorMessage, "error");
          console.log(error);
        }
      );
    this.showPaginationControls = false;
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
    const getLanguageJson = new SetLanguageComponent(this.httpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  setTableFlag(val, values) {
    this.tableFlag = val;
    this.get_filterCallList(values);
  }
  audioEvent() {
    this.alertMessage.alert(this.currentLanguageSet.noAudioFileUploded);
  }
  get_filterCallList(value) {
    let start_date =
      new Date(
        value.start_date -
          1 * (value.start_date.getTimezoneOffset() * 60 * 1000)
      )
        .toJSON()
        .slice(0, 10) + "T00:00:00.000Z";
    let end_date =
      new Date(
        value.end_date - 1 * (value.end_date.getTimezoneOffset() * 60 * 1000)
      )
        .toJSON()
        .slice(0, 10) + "T23:59:59.999Z";
    let state;
    if (this.state) {
      state = this.state.stateName;
    }
    // else {
    //   state = "";
    // }
    let requestObj = {
      providerServiceMapID: this.commonDataService.current_service.serviceID,
      beneficiaryCallType: this.callTypeName,
      beneficiaryCallSubType: this.callsubTypeID,
      startTimestamp: start_date,
      endTimestamp: end_date,
      state: state,
      district: this.district,
      gender: this.gender,
      beneficiaryPreferredLanguage: this.language,
      beneficiarySexualOrientation: this.sexuality,
      fileName: "Call_Type_Report"
    };

    console.log("Call type req obj", JSON.stringify(requestObj, null, 4));
    this.reportService.getAllReportsByDate(requestObj).subscribe((response) => {
      // console.log("Json data of response: ", JSON.stringify(response, null, 4));
      if (response) {
        saveAs(response,  requestObj.fileName+".xlsx");
        this.alertMessage.alert(this.currentLanguageSet.callTypeReportDownloaded);
      }else {
        this.alertMessage.alert(this.currentLanguageSet.noDataFound);
      }
    },
    (err) => {
      // this.alertService.alert(err.errorMessage, "error");
      if(err.status === 500)
      {
        this.alertMessage.alert(this.currentLanguageSet.noDataFound, 'info');
      }
      else
      this.alertMessage.alert(this.currentLanguageSet.errorWhileFetchingReport, 'error');
    })

    // write the api here to get filtercall list
    // this.reportService.getAllReportsByDate(requestObj).subscribe(
    //   (response: Response) => (this.data = this.successhandeler(response)),
    //   (err) => {
    //     this.alertMessage.alert(err.errorMessage, "error");
    //   }
    // );
  }
  toUTCDate(date) {
    const _utc = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
    return _utc;
  }

  millisToUTCDate(millis) {
    return this.toUTCDate(new Date(millis));
  }
  successhandeler(response) {
    // debugger;
    console.log(response, "respinse call wala");
    if (response.length > 5) {
      this.showPaginationControls = true;
    }
    if (response.length > 0) {
      // let array = response.filter(function (obj) {
      //   delete obj.benReport;
      //   for (var key in obj) {
      //     //  console.log(key, obj[key]);
      //     if (obj[key] == null) {
      //       obj[key] = "";
      //     }
      //   }
      //   return obj;
      // });
      this.downloadV2(response);
      // console.log(array);
      // let head = Object.keys(array[0]);
      // console.log(head);
      // new Angular2Csv(array, 'Consolidate Report', { headers: (head) });
      // this.alertMessage.alert('Consolidated report generated', 'success');
    } else {
      this.alertMessage.alert(
        this.currentLanguageSet.noCallTypeReportForSearchedCriteria
      );
    }
    return response;
  }

  populateCallTypes(response: any) {
    this.calltypes = response.map(function (item) {
      return { callTypeDesc: item.callGroupType };
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
    this.callSubTypes = this.callTypeObj
      .filter(function (item) {
        return item.callGroupType === callType;
      })
      .map(function (previousData, item) {
        return previousData.callTypes;
      })[0];
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
  downloadV2(result: any = []) {
    let criteria: any = [];
    let stateName = this.state
      ? this.state.stateName
        ? this.state.stateName
        : "Any"
      : "Any";
    criteria.push({ Filter_Name: "Start_Date", value: moment(this.start_date).format('DD-MM-YYYY') });
    criteria.push({ Filter_Name: "End_Date", value: moment(this.end_date).format('DD-MM-YYYY') });
    criteria.push({ Filter_Name: "State", value: stateName });
    criteria.push({
      Filter_Name: "District",
      value: this.district ? this.district : "Any",
    });
    criteria.push({
      Filter_Name: "Language",
      value: this.language ? this.language : "Any",
    });
    criteria.push({
      Filter_Name: "Call_Type",
      value: this.callTypeName ? this.callTypeName : "Any",
    });
    criteria.push({
      Filter_Name: "Call_Sub_Type",
      value: this.callsubTypeID ? this.callsubTypeID : "Any",
    });
    criteria.push({
      Filter_Name: "Gender",
      value: this.gender ? this.gender : "Any",
    });
    criteria.push({
      Filter_Name: "Sexual_Orientation",
      value: this.sexuality ? this.sexuality : "Any",
    });
    this.exportToxlsx(criteria, result);
  }
  exportToxlsx(criteria: any, result: any) {
    let headers = [
      "slNo",
      "agentID",
      "userRole",
      "callStartTime",
      "callEndTime",
      "callDate",
      "callHour",
      "callID",
      "phoneNo",
      "callType",
      "callSubType",
      "userName",
      "userLocation",
      "preferredLanguage",
      "isCalledEarlier",
      "beneficiaryID",
      "title",
      "beneficiaryName",
      "dob",
      "age",
      "gender",
      "state",
      "district",
      "subDistrict",
      "preferredLanguage",
      "occupation",
      "education",
      "sexualOrientation",
      "maritalStatus",
      "placeOfWork",
      "ivrsSelectedLanguage",
      "categoryName",
      "subCategoryName",
      "documentName",
      "counsellingCategoryName",
      "counsellingSubCategoryName",
      "counsellingDocumentName",
      "feedbackID",
      "feedback",
      "remarks",
    ];
    let wb_name = "Call Type Report";
    const criteria_worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(criteria);
    const report_worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(result, {
      header: headers,
    });

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
      Sheets: { Report: report_worksheet, Filter_Criteria: criteria_worksheet },
      SheetNames: ["Filter_Criteria", "Report"],
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
}
